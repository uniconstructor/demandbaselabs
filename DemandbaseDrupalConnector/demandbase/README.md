The Demandbase Drupal module provides integration with the Demandbase IP API.

#Prerequisities
* Drupal version 6.x or 7.x
* [CTools Siute Module](https://drupal.org/project/ctools) installed
* Optional: [Context Module](https://drupal.org/project/context) installed

#Installation
1. Download the latest version of the module from drupal.org
  * https://drupal.org/project/demandbase
2. Upload the module from within the Drupal Administration interface
  * Alternatively, copy the entire `/demandbase` folder into `[ROOT]/drupal/sites/all/modules`

#Resources
For a full walkthrough of setup and usage, visit:
http://wiki.demandbaselabs.com/mwiki/index.php?title=Demandbase_Drupal_Connector

#Usage
IMPORTANT: Set the demandbase key at admin/config/services/demandbase

Using Context
- Create a Context using the Demandbase Context conditions.

Using API
- You can use the following snippet of code to get the visitor's information:

  // Get an object of demandbase data for the visiting user.
  $data = demandbase_get_data();

##Cache Configuration
The Demandbase Drupal Module provides two types of cachine:
1. `demandbase_cache`
  * demandbase_cache override drupal default caching for anonymous user and store page cache in cache_page table for all pages or for specified paths if specified under admin/config/services/demandbase/cache path.
2. `demandbasee_memcache`
  * demandbase_memcache override drupal default caching for anonymous user and store page cache under memcached service which store cache on RAM for all pages or for specified paths if specified under admin/config/services/demandbase/cache path.

**Note:** demandbase_memcache will take priority over demandbase_cache module if following line is added in settings.php file:

`$conf['cache_class_cache_page'] = 'DemandBaseMemCacheDrupal';// this will take preference above demandbase_cache`

To enable `demandbase_memcache` add these following lines to your `settings.php`:
```
$conf['cache_backends'][] = 'sites/all/modules/demandbase/demandbase_memcache/demandbase_memcache.inc';
$conf['cache_default_class'] = 'DemandBaseMemCacheDrupal';
$conf['cache_class_cache_page'] = 'DemandBaseMemCacheDrupal';  // this will take preference above demandbase_cache
$conf['cache_class_cache_form'] = 'DrupalDatabaseCache';
//$conf['session_inc'] =  'sites/all/modules/demandbase/demandbase_memcache/demandbase_memcache-session.inc';
$conf['memcache_servers'] =  array('localhost:11211' => 'default');
```

