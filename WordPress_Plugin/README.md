#Demandbase Plugin for Wordpress

The Demandbase Plugin for Wordpress is part of Demandbase's Web Optimization Suite.
The Content Module is used to personalize and target content based on a visitor's company profile.

##Latest Production Version
The latest production version is availble via [WordPress.org](http://wordpress.org/plugins/demandbase-content-module/)

##Development Version
This repository contains the latest development build.

##Prerequisites
* Requires Demandbase Content Module license
* WordPress v3.0.1 or higher
* Compatible upto WordPress v3.81

#Installation
For complete installation instructions, see http://wordpress.org/plugins/demandbase-content-module/installation/.

1. If you have an existing Demandbase WordPress plugin, you **must** uninstall it before installing this one.
2. From your WordPress dashboard, go to *Plugins > Add New*.
3. [Download the latest production version](http://downloads.wordpress.org/plugin/demandbase-content-module.zip)
4. Install by uploading the `.zip` file, then activate the plugin.
5. After installation enter your Demandbase Content Module key.
  * Click *Demandbase* on the left admin navigation bar.
  * Copy paste your key into the *Demandbase API Key* text box, then click *Save Changes*

#Usage

Once installed, instructions are available within the plug-in.
From the left admin navigation, see *Demandbase > How To*.

The Settings page allows for simulating a visitor's company using a simple drop down list or by entering an IP address.

https://www.evernote.com/shard/s100/sh/6a117ec2-f714-45d7-a8eb-bf2dfae7d598/d83797595e0c144ecf27041400fda84a/deep/0/Screenshot%203/6/14,%2012:23%20PM.jpg

Shortcodes are used to conditionally display content blocks or to dynamic insert company profile attribute values.

https://www.evernote.com/shard/s100/sh/a2bc222c-2022-4b26-a309-05ecfcc63e7e/c3035e33709c2ecd290cdb113c7d0a0a/deep/0/Screenshot%203/6/14,%2012:41%20PM.jpg

An easy-to-use shortcode builder is added to the bottom of the page editor to help you build shortcodes and insert them into the page editor.

https://www.evernote.com/shard/s100/sh/ab95d4a2-1258-4985-a5c6-67c96a9f0e64/178792f7731474f064daeffac3a52587/deep/0/Screenshot%203/6/14,%2012:44%20PM.jpg

#Release Notes

##v1.0
**March 2014** - First public release available on [WordPress.org](http://wordpress.org/plugins/demandbase-content-module)

* Added shortcode builder to all post/page editing
* Added jQuery support in plugin
* Added db_main.js
* Added JavaScript visual form feedback to prevent usage errors
* Fixed up cleaning for POSTed data from Admin portal
* Entitlements function calls use the Demandbase IP address instead of visitor
* Added field and checkbox for admin to specify custom testing IP address
* First version with complex short code wrappings, admin interface, and other useful behavior as close to spec as possible
* Written by Anthony Palazzetti for Demandbase, Inc (apalazzetti[at]demandbase[dot]com)


