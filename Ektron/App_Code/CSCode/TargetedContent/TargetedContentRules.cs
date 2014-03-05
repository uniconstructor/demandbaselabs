using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Ektron.Cms.Common;
using System.Text.RegularExpressions;
using System.Configuration;
using Ektron.EnhancedData.Service;
using Ektron.EnhancedData.Common.Model.Service;
using System.Diagnostics;
using System.Text;
using System.Security.Cryptography;
using System.Xml;
using System.Net;
using System.IO;

namespace Ektron.Cms.Content.Targeting.Rules
{
    #region DemandBase Templates

    #region Demandbase Class
    public class DemandBaseTargetingInfo
    {
        string accountId = string.Empty;
        XmlDocument businessData = new XmlDocument();

        public DemandBaseTargetingInfo()
        {
            accountId = ConfigurationManager.AppSettings["DemandBase.AccountId"].ToString();

            // Get our XML Block of Data for this site visitor
            GetBusinessData();
        }

        private string GetFeedURL(string ipAddress)
        {
            string baseUrl = "http://api.demandbase.com/api/v2/ip.xml";
            string queryUrl = string.Format("{0}?key={1}&query={2}", baseUrl, accountId, ipAddress);

            return queryUrl;
        }

        private void GetBusinessData()
        {
            string ipAddress = Ektron.Cms.UserContext.IP;
            string cacheKey = string.Empty;

            if (HttpContext.Current.Request.Cookies["ekDemoIPAddress"] != null)
            {
                ipAddress = HttpContext.Current.Request.Cookies["ekDemoIPAddress"].Value;
            }

            if (!string.IsNullOrEmpty(ipAddress))
            {
                cacheKey = string.Format("Ektron_Demandbase_{0}", ipAddress);

                if (HttpContext.Current.Cache[cacheKey] != null)
                {
                    businessData.LoadXml((string)HttpContext.Current.Cache[cacheKey]);
                }
                else
                {
                    string queryUrl = GetFeedURL(ipAddress);
                    WebRequest request = WebRequest.Create(queryUrl);
                    request.Timeout = 5000;
                    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                    Stream resStream = response.GetResponseStream();
                    businessData.Load(resStream);

                    // Now, cache the info for this IP Address
                    CacheBusinessInfo(cacheKey, businessData.InnerXml);
                }
            }
        }

        public string GetBusinessField(string fieldName)
        {
            string fieldValue = string.Empty;

            try
            {
                if (businessData != null)
                {
                    fieldValue = businessData.SelectSingleNode(string.Format("result/{0}", fieldName)).InnerXml;
                }
            }
            catch (Exception ex)
            { 
                EventLog.WriteEntry("CMS400", string.Format("An Error Occurred in DemandBaseTargetingInfo.GetBusinessField() using field: {0}.\r\nError:\r\n{1}", fieldName, ex.Message), EventLogEntryType.Error);
            }

            return fieldValue;
        }

        private void CacheBusinessInfo(string cacheKey, string businessXml)
        {
            HttpContext.Current.Cache.Add(cacheKey, businessXml, null, DateTime.Now.AddMinutes(10), System.Web.Caching.Cache.NoSlidingExpiration, System.Web.Caching.CacheItemPriority.Normal, null);
        }
    }
    #endregion

    public abstract class DemandBaseRuleTemplate : RuleTemplate
    {
        string _businessPropertyType = null;
        StringOperatorField _fldOperator = null;

        public DemandBaseRuleTemplate(string businessPropertyType)
            : base(businessPropertyType)
        {
            _fldOperator = new StringOperatorField("operator", "operator", "");
            _businessPropertyType = businessPropertyType;
        }

        public override LocalizableValue Group
        {
            get { return new LocalizableValue("BusinessProperties", "Demandbase", ""); }
        }

        public override string Text
        {
            get { return String.Format("Demandbase {0} {{operator}} {{value}}", EscapeRuleText(_businessPropertyType)); }
        }

        public override string Title
        {
            get { return String.Format("{0}", EscapeRuleText(_businessPropertyType)); }
        }
    }
    public class DemandBaseIndustryTemplate : DemandBaseRuleTemplate
    {
        StringOperatorField _fldOperator = null;

        public DemandBaseIndustryTemplate(string industryType)
            : base("Industry")
        {
            _fldOperator = new StringOperatorField("operator", "operator", "");
        }

        public override bool Evaluate(Rule rule)
        {
            string op = rule.Values["operator"];
            string visitorIndustry = string.Empty;
            string ruleIndustry = rule.Values["value"];

            try
            {
                DemandBaseTargetingInfo dbInfo = new DemandBaseTargetingInfo();
                visitorIndustry = dbInfo.GetBusinessField("Industry");
            }
            catch (Exception ex)
            {
                EventLog.WriteEntry("CMS400", string.Format("An Error Occurred in DemandBaseIndustryTemplate.\r\nError:\r\n{0}", ex.Message), EventLogEntryType.Error);
            }

            return _fldOperator.Evaluate(visitorIndustry, op, ruleIndustry);
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
                    this.AddNumericField("value", "value", "");
                }

                return _fields;
            }
        }

        public override string Text
        {
            get { return "Visitor Industry {operator} {value}"; }
        }

        public override string Title
        {
            get { return "Industry..."; }
        }
    }

    #endregion
}
