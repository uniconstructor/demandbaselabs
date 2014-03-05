using System;
using System.Collections;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Collections.Generic;
using System.Net;
using System.Text.RegularExpressions;
using Ektron.Cms.Widget;
using Ektron.Cms.Common;

using Ektron.Cms.Content.Targeting;
using Ektron.Cms.Content.Targeting.Rules;
using Ektron.Cms.Content.Targeting.Rules.Facebook;
using Ektron.Cms.Content.Targeting.Rules.UserGeoIP;
using Ektron.Cms.PageBuilder;
using Ektron.Cms.BusinessObjects.Content.Targeting;
using Ektron.Cms;


namespace Ektron.Widgets
{
    public partial class TargetedContentWidget : System.Web.UI.UserControl, IWidget
    {

        #region member variables
        private string _conditionNameLabel = "";
        private string _defaultConditionName = "";
        private Ektron.Cms.PageBuilder.WidgetHost _host = null;

        private List<string> _rulesetNames = null;
        private List<string> _rulesets = null;
        private int _selectedZone = 0;
        private Dictionary<string, RuleTemplate> _ruleTemplates = new Dictionary<string, RuleTemplate>();

        private List<ColumnData> _currentColumns;

        private TargetedContent _targetContentManager;
        private TargetedContentData _targetedContent;

        #endregion

        #region Properties

        /// <summary>
        /// Gets or sets the list of current rule set names.
        /// </summary>
        [WidgetDataMember()]
        public List<string> RulesetNames
        {
            get { return _rulesetNames; }
            set { _rulesetNames = value; }
        }

        /// <summary>
        /// gets or sets the current list of rulesets.  The rulesets are serialized as JSON.
        /// </summary>
        [WidgetDataMember()]
        public List<string> Rulesets
        {
            get { return _rulesets; }
            set { _rulesets = value; }
        }

        /// <summary>
        /// Gets or sets the currently selected zone.
        /// </summary>
        [WidgetDataMember()]
        public int SelectedZone
        {
            get { return _selectedZone; }
            //set { _selectedZone = (_rulesets != null && value >= 0 && value < _rulesets.Count) ? value : 0; }
            set { _selectedZone = value; }
        }

        /// <summary>
        /// Gets or sets the Current TargetedContent Configuration Id.
        /// </summary>
        [WidgetDataMember()]
        public long TargetConfigurationId { get; set; }

        /// <summary>
        /// Gets or sets the current TargetContent Configuration
        /// </summary>
        [WidgetDataMember()]
        public TargetedContentData TargetedContent
        {
            get
            {
                if (_targetedContent == null)
                {
                    LoadTargetConfigurationData();
                }
                return _targetedContent;
            }
            set { _targetedContent = value; }
        }

        /// <summary>
        /// Gets or sets the list of currently supported Rule Templates.
        /// </summary>
        public Dictionary<string, RuleTemplate> RuleTemplates
        {
            get { return _ruleTemplates; }
            set { _ruleTemplates = value; }
        }


        /// <summary>
        /// Gets a TargetedContent Manager API instance.
        /// </summary>
        public TargetedContent TargetContentManager
        {
            get
            {
                if (_targetContentManager == null)
                {
                    EkRequestInformation requestInfo = ObjectFactory.GetRequestInfoProvider().GetRequestInformation();
                    _targetContentManager = new TargetedContent(requestInfo);
                }
                return _targetContentManager;
            }
        }

        private bool IsWorkarea
        {
            get
            {
                if (Request.Url.ToString().ToLower().Contains("/workarea/"))
                {
                    return true;
                }

                return false;
            }
        }

        public delegate void ExceptionHandler(TargetedContentWidget sender, Exception ex);

        public event ExceptionHandler EvaluateException;

        #endregion

        #region Events

        protected void Page_Init(object sender, EventArgs e)
        {
            Ektron.Cms.PageBuilder.PageBuilder pb = this.Page as Ektron.Cms.PageBuilder.PageBuilder;
            if (pb == null)
            {
                TargetedContentViewSet.SetActiveView(NonPageBuilderView);
                return;
            }

            Ektron.Cms.CommonApi api = new Ektron.Cms.CommonApi();

            Ektron.Cms.API.JS.RegisterJSInclude(this, Ektron.Cms.API.JS.ManagedScript.EktronJS);
            Ektron.Cms.API.JS.RegisterJSInclude(this, Ektron.Cms.API.JS.ManagedScript.EktronUICoreJS);
            Ektron.Cms.API.JS.RegisterJSInclude(this, Ektron.Cms.API.JS.ManagedScript.EktronUIDialogJS);
            Ektron.Cms.API.JS.RegisterJSInclude(this, api.ApplicationPath + "controls/paging/clientpaging/ektron.controls.clientpaging.js", "EktronWorkareaClientPagingJs");

            _host = (Ektron.Cms.PageBuilder.WidgetHost)Ektron.Cms.Widget.WidgetHost.GetHost(this);
            _host.ExpandOptions = Expandable.DontExpand; // Expandable.ExpandOnEdit;
            _host.HelpFile = api.AppPath + "help/Widget Chapter/Targeted Content/Creating Conditions with the Targeted Content Widget.htm";
            _host.Edit += new EditDelegate(host_edit);

            SaveButton.OnClientClick = "if(Ektron.RuleEditor.save('" + ruleEditor.UniqueID + "') == false){ return false;}";

            ruleEditor.Save += new EventHandler<SaveEventArgs>(ruleEditor_Save);


            pb.PageUpdated += new EventHandler(pb_PageUpdated);

            ConditionalZones.DeleteColumn += new EventHandler<ColumnDisplay.DeleteColumnEventArgs>(DeleteConditionalZone);
            ConditionalZones.WidgetHost = _host;
            ActiveColumn.WidgetHost = _host;

            // Localization
            _host.Title = "Targeted Content";
            btnAddConditionalZone.Text = "<span class=\"ui-icon ui-icon-plus\"></span>" + "new rule";
            btnEditConditionalZone.Text = "edit rule";
            _conditionNameLabel = "Name:";
            _defaultConditionName = "{0}";

            AddAllRuleTemplates();

            //Forced TargetedContent to be loaded.
            if (TargetConfigurationId > 0 && !IsWorkarea)
            {
                TargetedContent = null;
                _host.Edit -= new EditDelegate(host_edit);
            }

            _currentColumns = _host.GetColumns();

            if (Rulesets != null && _targetedContent == null)
            {
                //this is an upgraded version of the widget.
                LoadLegacyWidget();
            }

            LoadTargetConfigurationData();

            if (_host.GetColumns().Count == 0)
            {
                AddConditionalZone();
            }

            //if IsMasterlayoutLocked - show normal page view
            if ((Page as Ektron.Cms.PageBuilder.PageBuilder).Status == Ektron.Cms.PageBuilder.Mode.Editing && !IsMasterLayoutWidgetLocked())
            {
                if (TargetConfigurationId == 0 || IsWorkarea)
                {
                    TargetedContentViewSet.SetActiveView(PageEditing);
                }
                else
                {
                    SetGlobalTargetedContentView();
                }

                this.aSelectGlobalConfig.Attributes.Add("onclick", "Ektron.Widget.TargetedContentList.showDialog('" + ClientID + "');return false;");
                RefreshColumns();
            }
            else
            {
                TargetedContentViewSet.SetActiveView(View);

                //Get all available Widget child columns
                //these are the possible columns to show based upon evaluated conditions
                List<Ektron.Cms.PageBuilder.ColumnData> hostColumns = _host.GetColumns();

                if (hostColumns.Count > 0)
                {
                    ActiveColumn.IsEditable = !IsMasterLayoutWidgetLocked();
                    ActiveColumn.Columns = SelectConditionalZone();
                }
            }
        }

        protected void ucTargetContentList_TargetContentSelected(object sender, TargetContentEventArgs e)
        {

            this.TargetConfigurationId = e.TargetContentId;
            this.TargetedContent = null;

            List<ColumnData> columns = _host.GetColumns();
            columns.ForEach(c => _host.RemoveColumn(c.Guid));

            LoadTargetConfigurationData();

            SetGlobalTargetedContentView();

            _host.SaveWidgetDataMembers();

            //remove edit button:
            _host.Edit -= new EditDelegate(host_edit);
        }

        protected void Page_PreRender(object sender, EventArgs e)
        {
            Ektron.Cms.CommonApi api = new Ektron.Cms.CommonApi();
            string sitepath = api.SitePath;
            Ektron.Cms.API.JS.RegisterJSInclude(this, Ektron.Cms.API.JS.ManagedScript.EktronJS);

            SaveButton.OnClientClick = "if(Ektron.RuleEditor.save('" + ruleEditor.UniqueID + "') == false){ return false;}";

            if (PageEditing == TargetedContentViewSet.GetActiveView())
            {
                Ektron.Cms.API.JS.RegisterJSInclude(this, Ektron.Cms.API.JS.ManagedScript.EktronUICoreJS);
                Ektron.Cms.API.JS.RegisterJSInclude(this, Ektron.Cms.API.JS.ManagedScript.EktronUISortableJS);
                Ektron.Cms.API.JS.RegisterJSInclude(this, Ektron.Cms.API.JS.ManagedScript.EktronStringJS);
                Ektron.Cms.API.Css.RegisterCss(this, sitepath + "widgets/TargetedContent/css/TargetedContent.css", "TargetedContentCSS");
                Ektron.Cms.API.JS.RegisterJSInclude(this, sitepath + "widgets/TargetedContent/js/TargetedContent.js", "TargetedContentJS");

                hdnSelectedZone.Value = this.SelectedZone.ToString();
                Ektron.Cms.API.JS.RegisterJSBlock(this, string.Format("Ektron.Widget.TargetedContent.init(\"{0}\", {1})", wrapper.ClientID, _host.GetColumns().Count), "TargetedContentInit" + UniqueID);
            }
            else if (PageEditingGlobalConfig == TargetedContentViewSet.GetActiveView())
            {
                Ektron.Cms.API.Css.RegisterCss(this, sitepath + "widgets/TargetedContent/css/TargetedContent.css", "TargetedContentCSS");
                Ektron.Cms.API.JS.RegisterJSInclude(this, sitepath + "widgets/TargetedContent/js/TargetedContent.js", "TargetedContentJS");
            }
            else if ((Page as Ektron.Cms.PageBuilder.PageBuilder) != null && (Page as Ektron.Cms.PageBuilder.PageBuilder).Status == Ektron.Cms.PageBuilder.Mode.Editing)
            {
                //master layout with edit
                Ektron.Cms.API.Css.RegisterCss(this, sitepath + "widgets/TargetedContent/css/TargetedContent.css", "TargetedContentCSS");
            }
        }

        protected override void Render(HtmlTextWriter writer)
        {
            Page.ClientScript.RegisterForEventValidation(this.UniqueID);
            Page.ClientScript.RegisterForEventValidation(tbRulesetName.UniqueID);
            Page.ClientScript.RegisterForEventValidation(hdnSavedSetId.UniqueID);
            Page.ClientScript.RegisterForEventValidation(hdnSelectedZone.UniqueID);
            Page.ClientScript.RegisterForEventValidation(hdnZoneOrder.UniqueID);

            base.Render(writer);
        }

        /// <summary>
        /// Called when a ruleset is saved in the rule editor.
        /// </summary>
        /// <param name="save_sender"></param>
        /// <param name="e"></param>
        protected void ruleEditor_Save(object save_sender, SaveEventArgs e)
        {

            Rulesets[_selectedZone] = Ektron.Newtonsoft.Json.JsonConvert.SerializeObject(e.Rules);
            RulesetNames[_selectedZone] = tbRulesetName.Text;

            TargetedContent.Segments[_selectedZone].Rules = e.Rules;
            TargetedContent.Segments[_selectedZone].Name = tbRulesetName.Text;

        }

        /// <summary>
        /// Called when the user clicks to add a new target zone.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnAddConditionalZone_Click(object sender, EventArgs e)
        {
            AddConditionalZone();
            _host.OnEdit();
        }

        /// <summary>
        /// Called when "edit" is clicked on a Target Zone. 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnEditConditionalZone_Click(object sender, EventArgs e)
        {
            _host.OnEdit();
        }

        /// <summary>
        /// Called when the pagebuilder page is saved.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void pb_PageUpdated(object sender, EventArgs e)
        {
            _host = (Ektron.Cms.PageBuilder.WidgetHost)Ektron.Cms.Widget.WidgetHost.GetHost(this);
            //TargetedContentData targetContent = LoadTargetConfigurationData();
            SynchTargetConfiguration();
            //SaveConfiguration(targetContent);

        }

        /// <summary>
        /// Called when saving a ruleset.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void SaveButton_Click(object sender, EventArgs e)
        {
            if (tbRulesetName.Text != "")
            {
                tbRulesetName.Text = ValidateRuleSetName(tbRulesetName.Text, _selectedZone);

                if (Rulesets.Count < _selectedZone + 1)
                {
                    AddConditionalZone();
                }
                _rulesetNames[_selectedZone] = tbRulesetName.Text.Trim();
                ruleEditor.SaveRules();
                SynchTargetConfiguration();

                tbRulesetName.Text = "";
                RefreshColumns();
                TargetedContentViewSet.SetActiveView(PageEditing);
                _host.SaveWidgetDataMembers();
            }
        }

        /// <summary>
        /// Called when Cancel is clicked from Edit Rule Set.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void CancelButton_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(_rulesetNames[_rulesetNames.Count - 1]))
            {
                DeleteConditionalZone(new ColumnDisplay.DeleteColumnEventArgs(_currentColumns.Count - 1, _currentColumns[_currentColumns.Count - 1].Guid));
            }
            TargetedContentViewSet.SetActiveView(PageEditing);
        }

        /// <summary>
        /// Called when the currently selected target zone changes.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void SelectedZoneChanged(object sender, EventArgs e)
        {

            LoadTargetConfigurationData();
            int selectedZone = 0;
            Int32.TryParse(hdnSelectedZone.Value, out selectedZone);
            this.SelectedZone = selectedZone;
            _host.SaveWidgetDataMembers();
        }

        /// <summary>
        /// Called when the Target Zones are re-ordered.  Saves the re-ordereded targetContent configuration.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void ZoneOrderChanged(object sender, EventArgs e)
        {

            //Get the current targetConfiguration and copy personas to temp list.
            TargetedContentData targetConfig = LoadTargetConfigurationData();
            List<SegmentData> personaList = new List<SegmentData>();
            targetConfig.Segments.ForEach(p => personaList.Add(p));

            string[] straryZoneOrder = hdnZoneOrder.Value.Split(',');
            int[] aryZoneOrder = new int[straryZoneOrder.Length];

            for (int i = 0; i < straryZoneOrder.Length; i++)
            {
                int index = 0;
                if (!int.TryParse(straryZoneOrder[i], out index))
                {
                    throw new ArgumentException("Conditional zone index must be an integer. Value: '" + straryZoneOrder[i] + "'.");
                }
                aryZoneOrder[i] = index;
            }

            List<Ektron.Cms.PageBuilder.ColumnData> columnDataList = _host.GetColumns();
            if (_rulesets.Count != aryZoneOrder.Length || _rulesets.Count != _rulesetNames.Count || _rulesets.Count != columnDataList.Count)
            {
                throw new ArgumentOutOfRangeException("Number of conditional zones has changed when reordering.");
            }
            Guid[] aryGuid = new Guid[aryZoneOrder.Length];
            for (int i = 0; i < aryZoneOrder.Length; i++)
            {
                aryGuid[i] = columnDataList[i].Guid;
            }

            targetConfig.Segments.Clear();
            _currentColumns = new List<ColumnData>();
            List<string> rulesets = new List<string>(_rulesets.Count);
            List<string> rulesetNames = new List<string>(_rulesetNames.Count);
            for (int i = 0; i < aryZoneOrder.Length; i++)
            {
                int index = aryZoneOrder[i];
                Guid g = aryGuid[index];
                _host.RemoveColumn(g);
                _host.AddColumn(g);
                rulesets.Add(_rulesets[index]);
                rulesetNames.Add(_rulesetNames[index]);

                targetConfig.Segments.Add(personaList[index]);
                _currentColumns.Add(columnDataList.Find(c => c.Guid == g));
            }
            _rulesets = rulesets;
            _rulesetNames = rulesetNames;
            //hdnZoneOrder.Value = "";

            //need to reset current columsnbecause the ordering changed.
            //this needs to be updated so it can be saved correctly with target content config.
            //_currentColumns = _host.GetColumns();

            //SaveConfiguration(targetConfig);
            SynchTargetConfiguration();
            RefreshColumns();
        }

        /// <summary>
        /// Called when the widget enters edit mode.
        /// </summary>
        /// <param name="settings"></param>
        private void host_edit(string settings)
        {
            EditSelectedCondition();
        }

        protected void btnDeleteGlobalTargetContent_Click(object sender, EventArgs e)
        {
            TargetConfigurationId = 0;
            TargetedContent = null;
            TargetedContent.PageData.Zones[0].Columns.Clear();
            TargetedContent.Segments.Add(new SegmentData());
            SelectedZone = 0;

            //keep existing configuration on page.
            //PageBuilder pb = Page as PageBuilder;
            //pb.Pagedata.Widgets.AddRange(TargetedContent.PageData.Widgets);
            //DropZoneData zone = pb.Pagedata.Zones.Find(z => z.DropZoneID == _host.ZoneID);
            //zone.Columns.AddRange(TargetedContent.PageData.Zones[0].Columns);

            SynchTargetConfiguration();
            RefreshColumns();

            _host.SaveWidgetDataMembers();
            TargetedContentViewSet.SetActiveView(PageEditing);

            //re-add edit button:
            _host.Edit += new EditDelegate(host_edit);

        }


        #endregion

        #region helpers

        #region ********** Adding Rule templates **********

        private void AddRuleTemplate(RuleTemplate ruleTemplate)
        {
            _ruleTemplates.Add(ruleTemplate.ID, ruleTemplate);
        }

        private void AddAllRuleTemplates()
        {
            // URL-related rule templates
            AddSearchEngineRuleTemplates();
            AddRuleTemplate(new ReferringHostRuleTemplate());
            AddRuleTemplate(new QueryStringRuleTemplate());
            AddRuleTemplate(new CookieRuleTemplate());
            AddRuleTemplate(new DevicesRuleTemplate());

            // User-related rule templates
            AddDemandBaseRuleTemplates();
            AddMSLiveTemplates();
            AddMarketoTemplates();
            AddMSDynamicsTemplates();
            AddSalesforceTemplates();
            AddLeadScoreRuleTemplates();
            AddAnalyticsTemplates();
            AddRuleTemplate(new CMSFormSubmissionsTemplate("CMS Form Submission"));
            //Geo Ip
            AddGeoIPUserTemplates();
            //Facebook
            AddFacebookUserTemplates();
            AddRuleTemplate(new LoggedInRuleTemplate());
            AddRuleTemplate(new UserInGroupRuleTemplate());
            AddRuleTemplate(new UserInCommunityRuleTemplate());
            AddRuleTemplate(new UserHasTagRuleTemplate());
            AddUserPropertyRuleTemplates();

            // Date- and time-related rule templates
            AddRuleTemplate(new DateRuleTemplate());
            AddRuleTemplate(new DayOfWeekRuleTemplate());
            AddRuleTemplate(new DayOfMonthRuleTemplate());
            AddRuleTemplate(new HourOfDayRuleTemplate());

            // Default should be the last in the list
            AddRuleTemplate(new DefaultRuleTemplate());
        }

        private void AddDemandBaseRuleTemplates()
        {
            AddRuleTemplate(new DemandBaseIndustryTemplate("Industry"));
        }

        private void AddLeadScoreRuleTemplates()
        {
            AddRuleTemplate(new LeadScoreValueTemplate("LeadScore Value"));
            AddRuleTemplate(new LeadScoreHighProductTemplate("Highest LeadScore"));
        }

        private void AddMarketoTemplates()
        {
            AddRuleTemplate(new MarketoActivitiesTemplate("Activities"));
        }

        private void AddMSDynamicsTemplates()
        {
            AddRuleTemplate(new MSDynamicsCompanyBasicTemplate("MS Company"));
            AddRuleTemplate(new MSDynamicsCompanySizeTemplate("MS Company Size"));
            AddRuleTemplate(new MSDynamicsProductsOwnedTemplate("MS Products Owned"));
            AddRuleTemplate(new MSDynamicsLastConversionDateTemplate("MS Last Conversion Date"));
            AddRuleTemplate(new MSDynamicsPromotionTemplate("MS Promotion"));
        }

        private void AddSalesforceTemplates()
        {
            AddRuleTemplate(new SalesforceCompanyBasicTemplate("Company"));
            AddRuleTemplate(new SalesforceCompanySizeTemplate("Company Size"));
            AddRuleTemplate(new SalesforceProductsOwnedTemplate("Products Owned"));
            AddRuleTemplate(new SalesforceLastConversionDateTemplate("Last Conversion Date"));
            AddRuleTemplate(new SalesforcePromotionTemplate("Promotion"));
        }

        private void AddAnalyticsTemplates()
        {
            AddRuleTemplate(new AnalyicsPopularTemplate("Most Popular Content"));
            AddRuleTemplate(new AnalyicsIndustryTemplate("Popular by Industry"));
            AddRuleTemplate(new AnalyicsGeographicTemplate("Popular by Geography"));
            AddRuleTemplate(new AnalyicsGenderTemplate("Popular by Gender"));
            AddRuleTemplate(new AnalyicsAgeTemplate("Popular by Age Group"));
            AddRuleTemplate(new AnalyicsTrendingTemplate("Trending Content"));
        }

        private void AddGeoIPUserTemplates()
        {
            AddRuleTemplate(new GeoIPUserCountryRuleTemplate());
            AddRuleTemplate(new GeoIPUserRegionRuleTemplate());
        }

        private void AddFacebookUserTemplates()
        {
            AddRuleTemplate(new FacebookUserAgeRuleTemplate());
            AddRuleTemplate(new FacebookUserGenderRuleTemplate());
            AddRuleTemplate(new FacebookUserMaritalStatusRuleTemplate());
            AddRuleTemplate(new FacebookUserLikesRuleTemplate());
            AddRuleTemplate(new FacebookUserEmploymentRuleTemplate());
        }

        private void AddSearchEngineRuleTemplates()
        {
            AddRuleTemplate(new SearchEngineUsedRuleTemplate());
            AddRuleTemplate(new SearchEngineTypeRuleTemplate());
            AddRuleTemplate(new EkoVision_SearchEngineKeywordsRuleTemplate());
        }

        private void AddUserPropertyRuleTemplates()
        {
            Ektron.Cms.API.User.User userApi = new Ektron.Cms.API.User.User();
            Ektron.Cms.UserCustomPropertyData[] customProperties = userApi.EkUserRef.GetAllCustomProperty("");
            if (customProperties == null) return;

            foreach (Ektron.Cms.UserCustomPropertyData customProperty in customProperties)
            {
                switch (customProperty.PropertyValueType)
                {
                    case EkEnumeration.ObjectPropertyValueTypes.String:
                        AddRuleTemplate(new UserStringPropertyRuleTemplate(customProperty));
                        break;

                    case EkEnumeration.ObjectPropertyValueTypes.SelectList:
                        AddRuleTemplate(new UserSelectListPropertyRuleTemplate(customProperty));
                        break;

                    case EkEnumeration.ObjectPropertyValueTypes.Boolean:
                        AddRuleTemplate(new UserBooleanPropertyRuleTemplate(customProperty));
                        break;

                    case EkEnumeration.ObjectPropertyValueTypes.Numeric:
                        AddRuleTemplate(new UserNumericPropertyRuleTemplate(customProperty));
                        break;

                    case EkEnumeration.ObjectPropertyValueTypes.Date:
                        AddRuleTemplate(new UserDatePropertyRuleTemplate(customProperty));
                        break;

                    default:
                        break;
                }
            }
        }

        private void AddMSLiveTemplates()
        {
            AddRuleTemplate(new MSLiveLocationTemplate("MS Live Location"));
            AddRuleTemplate(new MSLiveBirthdateTemplate("MS Live Birthday"));
            AddRuleTemplate(new MSLiveGenderTemplate("MS Live Gender"));
            AddRuleTemplate(new MSLiveLanguageTemplate("MS Live Language"));
            AddRuleTemplate(new MSLiveOccupationTemplate("MS Live Occupation"));
            AddRuleTemplate(new MSLiveMaritalStatusTemplate("MS Live Marital Status"));
            AddRuleTemplate(new MSLiveHasChildrenTemplate("MS Live Has Children"));
            AddRuleTemplate(new MSLiveJobTitleTemplate("MS Live Job Title"));
        }

        #endregion

        #region Additional Rule Templates

        public abstract class MSLiveRuleTemplate : RuleTemplate
        {
            string _msLiveType = null;
            StringOperatorField _fldOperator = null;

            public MSLiveRuleTemplate(string msLiveType)
                : base(msLiveType)
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
                _msLiveType = msLiveType;
            }

            public override LocalizableValue Group
            {
                get { return new LocalizableValue("msLiveProperties", "MS Live", ""); }
            }

            public override string Text
            {
                get { return String.Format("{0} {{operator}} {{value}}", EscapeRuleText(_msLiveType)); }
            }

            public override string Title
            {
                get { return String.Format("{0}", EscapeRuleText(_msLiveType)); }
            }

            private string EscapeRuleText(string text)
            {
                return text.Replace('{', '[').Replace('}', ']');
            }
        }
        public class MSLiveLocationTemplate : MSLiveRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public MSLiveLocationTemplate(string msPopularProperty)
                : base("Visitor Location")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);
                        this.AddStringField("value", "value", "");
                        
                        EnumField field = new EnumField(new LocalizableValue("LiveIDLocation", "Location Type", ""));

                        field.Options.Add(new LocalizableValue("LiveIDCity", "City", ""));
                        field.Options.Add(new LocalizableValue("LiveIDRegion", "Region", ""));
                        field.Options.Add(new LocalizableValue("LiveIDCountry", "Country", ""));
                        field.Options.Add(new LocalizableValue("LiveIDPostalCode", "Postal Code", ""));
                        field.Options.Add(new LocalizableValue("LiveIDTimezone", "Time Zone", ""));
                        _fields.Add("LiveIDLocation", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Visitor Location {LiveIDLocation} {operator} {value}"; }
            }
        }

        public class MSLiveBirthdateTemplate : MSLiveRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public MSLiveBirthdateTemplate(string msPopularProperty)
                : base("Visitor Birthdate")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);
                        
                        EnumField field = new EnumField(new LocalizableValue("LiveIDBirthdate", "Timeframe", ""));

                        field.Options.Add(new LocalizableValue("LiveIDNextDay", "Next Day", ""));
                        field.Options.Add(new LocalizableValue("LiveIDNextWeek", "Next Week", ""));
                        field.Options.Add(new LocalizableValue("LiveIDNextMonth", "Next Month", ""));
                        field.Options.Add(new LocalizableValue("LiveIDLastDay", "Last Day", ""));
                        field.Options.Add(new LocalizableValue("LiveIDLastWeek", "Last Week", ""));
                        field.Options.Add(new LocalizableValue("LiveIDLastMonth", "Last Month", ""));
                        _fields.Add("LiveIDBirthdate", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Visitor Birthday {operator} {LiveIDBirthdate}"; }
            }
        }

        public class MSLiveGenderTemplate : MSLiveRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public MSLiveGenderTemplate(string msPopularProperty)
                : base("Visitor Gender")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);

                        EnumField field = new EnumField(new LocalizableValue("LiveIDGender", "Gender", ""));

                        field.Options.Add(new LocalizableValue("LiveIDMale", "Male", ""));
                        field.Options.Add(new LocalizableValue("LiveIDFemale", "Female", ""));
                        _fields.Add("LiveIDGender", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Visitor Birthday {operator} {LiveIDGender}"; }
            }
        }

        public class MSLiveLanguageTemplate : MSLiveRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public MSLiveLanguageTemplate(string msPopularProperty)
                : base("Visitor Language")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);

                        EnumField field = new EnumField(new LocalizableValue("LiveIDGender", "Gender", ""));

                        field.Options.Add(new LocalizableValue("LiveIDMale", "Male", ""));
                        field.Options.Add(new LocalizableValue("LiveIDFemale", "Female", ""));
                        _fields.Add("LiveIDGender", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Visitor Birthday {operator} {LiveIDGender}"; }
            }
        }

        public class MSLiveOccupationTemplate : MSLiveRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public MSLiveOccupationTemplate(string msPopularProperty)
                : base("Visitor Occupation")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);

                        EnumField field = new EnumField(new LocalizableValue("LiveIDGender", "Gender", ""));

                        field.Options.Add(new LocalizableValue("LiveIDMale", "Male", ""));
                        field.Options.Add(new LocalizableValue("LiveIDFemale", "Female", ""));
                        _fields.Add("LiveIDGender", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Visitor Birthday {operator} {LiveIDGender}"; }
            }
        }

        public class MSLiveMaritalStatusTemplate : MSLiveRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public MSLiveMaritalStatusTemplate(string msPopularProperty)
                : base("Visitor Marital Status")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);

                        EnumField field = new EnumField(new LocalizableValue("LiveIDGender", "Gender", ""));

                        field.Options.Add(new LocalizableValue("LiveIDMale", "Male", ""));
                        field.Options.Add(new LocalizableValue("LiveIDFemale", "Female", ""));
                        _fields.Add("LiveIDGender", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Visitor Birthday {operator} {LiveIDGender}"; }
            }
        }

        public class MSLiveHasChildrenTemplate : MSLiveRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public MSLiveHasChildrenTemplate(string msPopularProperty)
                : base("Visitor Has Children")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);

                        EnumField field = new EnumField(new LocalizableValue("LiveIDGender", "Gender", ""));

                        field.Options.Add(new LocalizableValue("LiveIDMale", "Male", ""));
                        field.Options.Add(new LocalizableValue("LiveIDFemale", "Female", ""));
                        _fields.Add("LiveIDGender", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Visitor Birthday {operator} {LiveIDGender}"; }
            }
        }

        public class MSLiveJobTitleTemplate : MSLiveRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public MSLiveJobTitleTemplate(string msPopularProperty)
                : base("Visitor Job Title")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);

                        EnumField field = new EnumField(new LocalizableValue("LiveIDGender", "Gender", ""));

                        field.Options.Add(new LocalizableValue("LiveIDMale", "Male", ""));
                        field.Options.Add(new LocalizableValue("LiveIDFemale", "Female", ""));
                        _fields.Add("LiveIDGender", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Visitor Birthday {operator} {LiveIDGender}"; }
            }
        }

        public class CMSFormSubmissionsTemplate : RuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public CMSFormSubmissionsTemplate(string sfCompanyProperty)
                : base("CMS Form Submission")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddStringField("formField", "formField", "");
                        this.AddField(_fldOperator);
                        this.AddStringField("value", "value", "");
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Form Submission {formField} {operator} {value}"; }
            }

            public override string Title
            {
                get { return String.Format("{0}", "CMS Form Submission"); }
            }
        }

        public abstract class AnalyticsRuleTemplate : RuleTemplate
        {
            string _analyticsType = null;
            StringOperatorField _fldOperator = null;

            public AnalyticsRuleTemplate(string analyticsType)
                : base(analyticsType)
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
                _analyticsType = analyticsType;
            }

            public override LocalizableValue Group
            {
                get { return new LocalizableValue("analyticsProperties", "Analytics", ""); }
            }

            public override string Text
            {
                get { return String.Format("{0} {{operator}} {{value}}", EscapeRuleText(_analyticsType)); }
            }

            public override string Title
            {
                get { return String.Format("{0}", EscapeRuleText(_analyticsType)); }
            }

            private string EscapeRuleText(string text)
            {
                return text.Replace('{', '[').Replace('}', ']');
            }
        }
        public class AnalyicsPopularTemplate : AnalyticsRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public AnalyicsPopularTemplate(string sfCompanyProperty)
                : base("Most Popular Content")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);
                        this.AddStringField("value", "value", "");
                        EnumField field = new EnumField(new LocalizableValue("timeframe", "Timeframe", ""));

                        field.Options.Add(new LocalizableValue("LastDay", "Last Day", ""));
                        field.Options.Add(new LocalizableValue("LastWeek", "Last Week", ""));
                        field.Options.Add(new LocalizableValue("LastMonth", "Last Month", ""));
                        field.Options.Add(new LocalizableValue("LastYear", "Last Year", ""));
                        _fields.Add("timeframe", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Most Popular Content {timeframe}"; }
            }
        }

        public class AnalyicsIndustryTemplate : AnalyticsRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public AnalyicsIndustryTemplate(string sfCompanyProperty)
                : base("Popular Content by industry")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);
                        this.AddStringField("value", "value", "");
                        EnumField field = new EnumField(new LocalizableValue("timeframe", "Timeframe", ""));

                        field.Options.Add(new LocalizableValue("LastDay", "Last Day", ""));
                        field.Options.Add(new LocalizableValue("LastWeek", "Last Week", ""));
                        field.Options.Add(new LocalizableValue("LastMonth", "Last Month", ""));
                        field.Options.Add(new LocalizableValue("LastYear", "Last Year", ""));
                        _fields.Add("timeframe", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Most Popular Content {timeframe}"; }
            }
        }

        public class AnalyicsGeographicTemplate : AnalyticsRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public AnalyicsGeographicTemplate(string sfCompanyProperty)
                : base("Popular Content by Geography")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);
                        this.AddStringField("value", "value", "");
                        EnumField field = new EnumField(new LocalizableValue("timeframe", "Timeframe", ""));

                        field.Options.Add(new LocalizableValue("LastDay", "Last Day", ""));
                        field.Options.Add(new LocalizableValue("LastWeek", "Last Week", ""));
                        field.Options.Add(new LocalizableValue("LastMonth", "Last Month", ""));
                        field.Options.Add(new LocalizableValue("LastYear", "Last Year", ""));
                        _fields.Add("timeframe", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Most Popular Content {timeframe}"; }
            }
        }

        public class AnalyicsGenderTemplate : AnalyticsRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public AnalyicsGenderTemplate(string sfCompanyProperty)
                : base("Popular Content by Gender")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);
                        this.AddStringField("value", "value", "");
                        EnumField field = new EnumField(new LocalizableValue("timeframe", "Timeframe", ""));

                        field.Options.Add(new LocalizableValue("LastDay", "Last Day", ""));
                        field.Options.Add(new LocalizableValue("LastWeek", "Last Week", ""));
                        field.Options.Add(new LocalizableValue("LastMonth", "Last Month", ""));
                        field.Options.Add(new LocalizableValue("LastYear", "Last Year", ""));
                        _fields.Add("timeframe", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Most Popular Content {timeframe}"; }
            }
        }

        public class AnalyicsAgeTemplate : AnalyticsRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public AnalyicsAgeTemplate(string sfCompanyProperty)
                : base("Popular Content by Age")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);
                        this.AddStringField("value", "value", "");
                        EnumField field = new EnumField(new LocalizableValue("timeframe", "Timeframe", ""));

                        field.Options.Add(new LocalizableValue("LastDay", "Last Day", ""));
                        field.Options.Add(new LocalizableValue("LastWeek", "Last Week", ""));
                        field.Options.Add(new LocalizableValue("LastMonth", "Last Month", ""));
                        field.Options.Add(new LocalizableValue("LastYear", "Last Year", ""));
                        _fields.Add("timeframe", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Most Popular Content {timeframe}"; }
            }
        }

        public class AnalyicsTrendingTemplate : AnalyticsRuleTemplate
        {
            StringOperatorField _fldOperator = null;

            public AnalyicsTrendingTemplate(string sfCompanyProperty)
                : base("Trending Content")
            {
                _fldOperator = new StringOperatorField("operator", "operator", "");
            }

            public override bool Evaluate(Rule rule)
            {
                // If we get to here, then we never found a match.  Return false;
                return false;
            }

            private Dictionary<string, Field> _fields = null;
            public override Dictionary<string, Field> Fields
            {
                get
                {
                    if (null == _fields)
                    {
                        _fields = new Dictionary<string, Field>();
                        this.AddField(_fldOperator);
                        this.AddStringField("value", "value", "");
                        EnumField field = new EnumField(new LocalizableValue("timeframe", "Timeframe", ""));

                        field.Options.Add(new LocalizableValue("LastDay", "Last Day", ""));
                        field.Options.Add(new LocalizableValue("LastWeek", "Last Week", ""));
                        field.Options.Add(new LocalizableValue("LastMonth", "Last Month", ""));
                        field.Options.Add(new LocalizableValue("LastYear", "Last Year", ""));
                        _fields.Add("timeframe", field);
                    }
                    return _fields;
                }
            }

            public override string Text
            {
                get { return "Content Trending {timeframe}"; }
            }
        }

        #endregion

        /// <summary>
        /// Evaluates the supplied rules and returns true if the rule conditions are met.
        /// </summary>
        /// <param name="rules"></param>
        /// <returns></returns>
        private bool EvaluateRuleSet(List<Rule> rules)
        {
            bool retval = false;
            Dictionary<Int32, bool> evals = new Dictionary<Int32, bool>();

            foreach (Rule rule in rules)
            {
                RuleTemplate ruleTemplate;

                try
                {
                    ruleTemplate = RuleTemplates[rule.RuleTemplateID];
                }
                catch (KeyNotFoundException exception)
                {
                    string _error = exception.Message;
                    continue;
                }

                bool eval = false;
                try
                {
                    eval = ruleTemplate.Evaluate(rule);
                }
                catch (Exception ex)
                {
                    if (EvaluateException != null)
                    {
                        EvaluateException(this, ex);
                    }
                }

                // if the rule doesn't have a parent, it's an "OR"
                Int32 id = ((rule.ParentID == -1) ? rule.ID : rule.ParentID);

                try
                {
                    evals[id] &= eval;
                }
                catch
                {
                    evals[id] = eval;
                }
            }

            foreach (Rule rule in rules)
            {
                if (rule.ParentID == -1)
                {
                    try
                    {
                        retval |= evals[rule.ID];
                    }
                    catch { }
                    if (retval) break;
                }
            }

            return retval;
        }

        /// <summary>
        /// Returns the Column to display based upon the current rulesets evaluation.
        /// </summary>
        /// <returns></returns>
        protected List<ColumnDisplayData> SelectConditionalZone()
        {
            Ektron.Cms.PageBuilder.PageBuilder pb = Page as Ektron.Cms.PageBuilder.PageBuilder;
            ColumnDataSerialize selectedColumn = null;

            if (TargetedContent != null)
            {
                //Evaluate the rulesets and get the selected column
                for (int i = 0; i < Rulesets.Count; i++)
                {
                    if (!String.IsNullOrEmpty(Rulesets[i]))
                    {
                        List<Rule> rules = Ektron.Newtonsoft.Json.JsonConvert.DeserializeObject<List<Rule>>(Rulesets[i]);
                        if (EvaluateRuleSet(rules))
                        {
                            selectedColumn = TargetedContent.PageData.Zones[0].Columns[i];
                            break;
                        }
                    }
                }
            }

            //Add the selected column to the ColumnDisplay List 
            //Add the TargetConfig Widgets to the Page Widgets collection
            List<ColumnDisplayData> columns = new List<ColumnDisplayData>();
            if (selectedColumn != null)
            {
                //if the page already has widgets for this column, remove them all.
                //pb.Pagedata.Widgets.RemoveAll(w => w.ColumnGuid == selectedColumn.Guid);

                //add column and widgets to pagebuilder data.
                columns.Add(new ColumnDisplayData(ColumnData.ConvertFromColumnDataSerialize(selectedColumn)));

                //add column to page.
                DropZoneData zone = pb.Pagedata.Zones.Find(z => z.DropZoneID == _host.ZoneID);
                zone.Columns.Add(selectedColumn);

                if (TargetConfigurationId != 0)
                {
                    //Add Saved Target Content Config widgets to page
                    pb.Pagedata.Widgets.AddRange(TargetedContent.PageData.Widgets);

                    //Set widgets Target Content Widgets Dropezone id
                    TargetedContent.PageData.Widgets.ForEach(w => w.DropID = zone.DropZoneID);
                }



            }

            return columns;

        }

        /// <summary>
        /// Adds a new blank Target Condition Zone to the TargetedContent Widget.
        /// </summary>
        /// <returns></returns>
        protected Int32 AddConditionalZone()
        {
            tbRulesetName.Text = "";

            _host.AddColumn();
            TargetedContent.Segments.Add(new SegmentData());
            SynchTargetConfiguration();

            //messes up workarea edit
            //SaveConfiguration(TargetedContent);

            RulesetNames.Add("");
            Rulesets.Add("");
            this.SelectedZone = _rulesets.Count - 1;

            RefreshColumns();

            return _selectedZone;
        }

        /// <summary>
        /// Deletes a segment zone from the current Targeted Content Configuration.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void DeleteConditionalZone(object sender, ColumnDisplay.DeleteColumnEventArgs e)
        {
            DeleteConditionalZone(e);
        }

        private void DeleteConditionalZone(ColumnDisplay.DeleteColumnEventArgs e)
        {
            int zoneIndexToDelete = e.Index;
            if (zoneIndexToDelete >= this.SelectedZone)
            {
                this.SelectedZone = 0;
            }
            _host.RemoveColumn(e.Guid);

            TargetedContent.PageData.Zones[0].Columns.RemoveAll(c => c.Guid == e.Guid);
            TargetedContent.Segments.RemoveAt(zoneIndexToDelete);

            LoadTargetConfigurationData();

            if (_host.GetColumns().Count == 0)
            {
                AddConditionalZone();
            }

            RefreshColumns();
        }

        /// <summary>
        /// Puts the widget in edi tmode and loads the currently selected condition in the rule editor.
        /// </summary>
        /// <returns></returns>
        protected Int32 EditSelectedCondition()
        {
            TargetedContentViewSet.SetActiveView(Edit);

            lblConditionName.Text = _conditionNameLabel;

            if (_rulesets[_selectedZone] != "" && _rulesets[_selectedZone] != null)
            {
                List<Rule> rules = Ektron.Newtonsoft.Json.JsonConvert.DeserializeObject<List<Rule>>(_rulesets[_selectedZone]);
                ruleEditor.Rules = rules;
            }

            tbRulesetName.Text = _rulesetNames[_selectedZone];

            ruleEditor.RuleTemplates = _ruleTemplates;
            ruleEditor.DataBind();

            return _selectedZone;
        }


        /// <summary>
        /// Refreshes the display with the current configuration.
        /// </summary>
        private void RefreshColumns()
        {

            List<Ektron.Cms.PageBuilder.ColumnDataSerialize> columnDataList = TargetedContent.PageData.Zones[0].Columns;

            int numColumns = columnDataList.Count;
            List<ColumnDisplayData> columnDisplayList = new List<ColumnDisplayData>(numColumns);

            for (int i = 0; i < numColumns; i++)
            {
                string strName = "";
                try
                {
                    strName = EkFunctions.HtmlEncode(RulesetNames[i]);
                }
                catch { }

                if ((string.IsNullOrEmpty(strName) || strName.Trim().Length == 0) && tbRulesetName.Text.Trim().Length > 0)
                {
                    strName = tbRulesetName.Text;
                    RulesetNames[i] = strName;
                }
                else if ("" == strName)
                {
                    strName = String.Format(_defaultConditionName, i + 1);
                }
                ColumnDisplayData cdd = new ColumnDisplayData(ColumnData.ConvertFromColumnDataSerialize(columnDataList[i]), strName);
                columnDisplayList.Add(cdd);
            }
            ConditionalZones.Columns = columnDisplayList;

            //resetting Rulesets = null before saving (legacy properties)
            Rulesets = null;
            RulesetNames = null;

            _host.SaveWidgetDataMembers();
            LoadTargetConfigurationData();
        }

        private void SetGlobalTargetedContentView()
        {
            TargetedContentViewSet.SetActiveView(PageEditingGlobalConfig);
            ucSpanGlobalConfigTitle.InnerHtml = TargetedContent.Name;

            imgRemove.Src = TargetContentManager.RequestInformation.ApplicationPath + "/PageBuilder/PageControls/" + (Page as Ektron.Cms.PageBuilder.PageBuilder).Theme + "images/icon_close.png";
            imgRemove.Alt = btnDeleteConfigurationColumn.Attributes["title"] = "Remove Global Target Configuration";
        }

        private string ValidateRuleSetName(string ruleSetName, int selectedzone)
        {
            int count = 0, i = 0;
            foreach (string name in _rulesetNames)
            {
                if (!string.IsNullOrEmpty(name) && i != selectedzone)
                {
                    if (name.Contains(ruleSetName))
                    {
                        count++;
                    }
                }
                i++;
            }

            if (count > 0)
            {
                ruleSetName = string.Format("{0}({1})", ruleSetName, count);
            }

            return ruleSetName;
        }

        #region TargetContent Persistence
        /// <summary>
        /// Gets the persona definition for the supplied ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        private TargetedContentData GetTargetConfiguration(long targetContentId)
        {
            TargetedContentData tc = null;

            if (targetContentId > 0)
            {
                tc = TargetContentManager.GetItem(targetContentId);
            }
            if (tc == null)
            {
                //New target Content Data
                tc = new TargetedContentData();
                SegmentData p = new SegmentData() { };

                tc.PageData = new PageData();//PageData.Restore(pageXml);
                tc.PageData.Zones = new List<DropZoneData>();
                tc.PageData.Zones.Add(new DropZoneData());
                tc.PageData.Zones[0].Columns = new List<ColumnDataSerialize>();
            }


            return tc;
        }

        /// <summary>
        /// Loads current TargetedCOntent COnfiguration and populates RuleSets.
        /// </summary>
        /// <returns></returns>
        private TargetedContentData LoadTargetConfigurationData()
        {

            //if (TargetConfigurationId == 0)
            //{
            //    if (Session[Page.ClientID + "_TargetConfigurationId"] != null)
            //    {
            //        long targetId = 0;
            //        long.TryParse(Session[Page.ClientID + "_TargetConfigurationId"].ToString(), out targetId);
            //        TargetConfigurationId = targetId;
            //    }
            //}

            if (_targetedContent == null)
            {
                _targetedContent = GetTargetConfiguration(TargetConfigurationId);
            }

            if (_targetedContent != null)
            {
                if (Rulesets == null)
                {
                    Rulesets = new List<string>();
                }

                if (RulesetNames == null)
                {
                    RulesetNames = new List<string>();
                }

                Rulesets.Clear();
                RulesetNames.Clear();
                _targetedContent.Segments.ForEach(delegate(SegmentData p)
                {
                    Rulesets.Add(p.ToJson());
                    RulesetNames.Add(p.Name);
                });
            }

            return _targetedContent;

        }

        public void SynchTargetConfiguration()
        {
            TargetedContent.PageData.Zones[0].Columns = ColumnData.ConvertToColumnDataSerializeList(_currentColumns);

            //get list of child column Ids 
            List<Guid> columnIdList = new List<Guid>();
            _currentColumns.ForEach(c => columnIdList.Add(c.Guid));

            //Get all widgets  that targeted content uses.
            Ektron.Cms.PageBuilder.PageBuilder pb = this.Page as Ektron.Cms.PageBuilder.PageBuilder;
            TargetedContent.PageData.Widgets = pb.Pagedata.Widgets.FindAll(w => columnIdList.Contains(w.ColumnGuid));

        }

        /// <summary>
        /// Saves the supplied TargetedContent Configuration.
        /// </summary>
        /// <param name="targetConfiguration"></param>
        public void SaveConfiguration(TargetedContentData targetConfiguration)
        {
            //update TargetedContentConfiguration properties with current widget configuration
            targetConfiguration.PageData.Zones[0].Columns = ColumnData.ConvertToColumnDataSerializeList(_currentColumns);

            //get list of child column Ids 
            List<Guid> columnIdList = new List<Guid>();
            _currentColumns.ForEach(c => columnIdList.Add(c.Guid));

            //Get all widgets  that targeted content uses.
            Ektron.Cms.PageBuilder.PageBuilder pb = this.Page as Ektron.Cms.PageBuilder.PageBuilder;
            targetConfiguration.PageData.Widgets = pb.Pagedata.Widgets.FindAll(w => columnIdList.Contains(w.ColumnGuid));

            //remove targetcontent widgets from pagebuilder page.
            //they wil be added at runtime when the targeted content configuration is loaded.
            //targetConfiguration.PageData.Widgets.ForEach(w => pb.Pagedata.Widgets.Remove(w));

            if (targetConfiguration.Id == 0)
            {
                Criteria<TargetedContentProperty> criteria = new Criteria<TargetedContentProperty>();
                criteria.AddFilter(TargetedContentProperty.Name, CriteriaFilterOperator.Contains, targetConfiguration.Name);
                List<TargetedContentData> list = TargetContentManager.GetList(criteria);

                if (list.Count > 0)
                {
                    targetConfiguration.Name = string.Format("{0}({1})", targetConfiguration.Name, list.Count);
                }

                TargetContentManager.Add(targetConfiguration);
            }
            else
            {
                TargetContentManager.Update(targetConfiguration);
            }

            TargetConfigurationId = targetConfiguration.Id;

        }

        /// <summary>
        /// Loads TargetContent Property based on legact widget properties
        /// </summary>
        private void LoadLegacyWidget()
        {
            //this is an upgraded version of the widget.
            //Load New TargetContent data object from legacy properties

            _targetedContent = new TargetedContentData();
            SegmentData p = new SegmentData() { };

            _targetedContent.PageData = new PageData();
            _targetedContent.PageData.Zones = new List<DropZoneData>();
            _targetedContent.PageData.Zones.Add(new DropZoneData());
            _targetedContent.PageData.Zones[0].Columns = new List<ColumnDataSerialize>();
            SynchTargetConfiguration();

            for (int index = 0; index < Rulesets.Count; index++)
            {
                List<Rule> rules = Ektron.Newtonsoft.Json.JsonConvert.DeserializeObject<List<Rule>>(Rulesets[index]);
                if (rules == null)
                {
                    rules = new List<Rule>();
                }

                SegmentData segment = new SegmentData() { Name = RulesetNames[index] };
                segment.Rules = rules;
                _targetedContent.Segments.Add(segment);
            }
        }

        /// <summary>
        /// Checks if the page uses a master page and if so, is the the widget currently locked.  
        /// </summary>
        /// <returns>Returns true if the widget is locked.</returns>
        public bool IsMasterLayoutWidgetLocked()
        {
            Ektron.Cms.PageBuilder.PageBuilder pb = Page as Ektron.Cms.PageBuilder.PageBuilder;
            if (!pb.Pagedata.IsMasterLayout && pb.Pagedata.MasterZonesIDList.Count > 0)
            {
                if (pb.Pagedata.MasterZonesIDList.Contains(_host.ZoneID))
                {
                    return true;
                }
            }

            return false;
        }
        #endregion

        #endregion
    }
}
