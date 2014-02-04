wordpress_plugin
================

The Demandbase Connector / Plugin for WordPress

V 1.10

Written by Anthony Palazzetti
for Demandbase, Inc
apalazzetti@demandbase.com

Created:    January 16, 2014
Updated:     Feb 4, 2014


This WordPress plugin is designed to allow access to the Demandbase API through the standard token/IP method. If you use the SID API, this will not work for you. If you do not know which API you are using, you can find out by looking at the URL you are using. If it's of the form: api.demandbase.com/api/v2/ip.json?query=XX.XX.XX.XX&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX then you are using the CORRECT API for use with this plugin.

Installation

1. If you have an existing Demandbase WordPress plugin, you MUST uninstall it before installing this one.
2. From your WordPress dashboard, go to "Plugins->Add New".
3. Install via upload and activate the plugin.
4. You must set your API key after installation. To do this, click "Demandbase" on the left admin navigation bar.

Usage

Instructions are available via the interface after install on the "Demandbase->How To" page.


Changelog Post V 1.0

V 1.10
Feb 3, 2014
- Added shortcode builder to all post/page editing

V 1.03
Feb 3, 2014
- Added jQuery support in plugin
- Added db_main.js
- Added JavaScript visual form feedback to prevent usage errors
- Fixed up cleaning for POSTed data from Admin portal

V 1.02
Jan 24, 2014
- Made entitlements function calls use the Demandbase IP address instead of visitor

V 1.01
Jan 23, 2014
- Added field and checkbox for admin to specify custom testing IP address

V 1.0
Jan 22, 2014
- First version with complex short code wrappings, admin interface, and other useful behavior as close to spec as possible
