#Demandbase WebTrends Connector
This connector sends Demandbase Company Profile attributes to WebTrends custom measures.

#Configuration

1. Setup [Custom Measures](http://help.webtrends.com/en/analytics9admin/adding_calculated_measure_to_new_custom_report.html) in WebTrends
2. Define `fields`, listing the Demandbase attribute variable name corresponding to each Custom Measure
  * *Your Demandbase Solutions Consultant will provide the configured connector.*
3. Set `logging` to `true` for testing, then set to `false` before deploying to production

#Installation

1. Place your configured tag in the template page within your CMS or Tag Management System
2. Create a [Custom Report](http://help.webtrends.com/en/analytics9admin/how_to_config_custom_reports_details.html) with the Csutom Measures to verify data is properly flowing to WebTrends.