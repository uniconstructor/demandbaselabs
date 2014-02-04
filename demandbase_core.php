<?php   
    /* 
    Plugin Name: Demandbase
    Plugin URI: http://demandbaselabs.com/docs/wiki/index.php?title=Wordpress_Connector
    Description: Plugin for managing Demandbase content on a WordPress site 
    Author: Anthony Palazzetti
    Version: 1.03 RC
    Author URI: http://www.demandbaselabs.com 
    */
        
// Load up some javascript
function register_javascript() {
    wp_enqueue_script('jquery');
    
    wp_register_script( 'db_main', plugins_url('demandbase/assets/js/db_main.js'));
    wp_enqueue_script('db_main');
}
add_action( 'admin_init','register_javascript');

// Enable shortcodes in widgets
add_filter('widget_text', 'do_shortcode');

/*
 * Function to get the settings from database
 * 
 */
function get_demandbase_settings()
{
	$db_settings = array(
		'api_key' 			=> get_option('demandbase_api_key'), // Their API key
        'simulation_active' => get_option('demandbase_sim_active'), // Simulation mode is actve
		'test_company_ip' 	=> get_option('demandbase_company_ip'), // Testing company IP
        'custom_ip_active' 	=> get_option('demandbase_custom_ip_active'), // Custom IP mode is active
		'test_custom_ip' 	=> get_option('demandbase_custom_ip') // Custom test IP
	);
	
	return $db_settings;
}

/*
 * Loads up the admin settings main page
 *
 */
function demandbase_admin() {
	
	$db_settings = get_demandbase_settings();
	
	if(strlen($db_settings['api_key']) != 40): ?>
		<div class="error"><p><?php _e('Your Demandbase API key has <strong>NOT</strong> been set. You must set this to use the plugin!', 'demandbase_translation' ); ?></p></div>
	<?php endif; ?>
	
	<?php if(strlen($db_settings['api_key']) == 40 && $db_settings['simulation_active'] != 1): ?>
		<div class="updated"><p><?php _e('Your Demandbase plugin is configured properly and is in <strong>LIVE</strong> mode.', 'demandbase_translation' ); ?></p></div>
	<?php endif; ?>
	
	<?php if(strlen($db_settings['api_key']) == 40 && $db_settings['simulation_active'] == 1): ?>
		<div class="updated"><p><?php _e('Your Demandbase plugin is configured properly and is in <strong>SIMULATION</strong> mode.', 'demandbase_translation' ); ?></p></div>
	<?php endif;
	
    include('demandbase_settings_page.php');
}

/*
 * Loads up the how-to page
 * 
 */
function demandbase_howto() {
	$db_settings = get_demandbase_settings();
	
	if(strlen($db_settings['api_key']) != 40): ?>
		<div class="error"><p><?php _e('Your Demandbase API key has <strong>NOT</strong> been set. You must set this to use the plugin!', 'demandbase_translation' ); ?></p></div>
	<?php endif; ?>
	
	<?php if(strlen($db_settings['api_key']) == 40 && $db_settings['simulation_active'] != 1): ?>
		<div class="updated"><p><?php _e('Your Demandbase plugin is configured properly and is in <strong>LIVE</strong> mode.', 'demandbase_translation' ); ?></p></div>
	<?php endif; ?>
	
	<?php if(strlen($db_settings['api_key']) == 40 && $db_settings['simulation_active'] == 1): ?>
		<div class="updated"><p><?php _e('Your Demandbase plugin is configured properly and is in <strong>SIMULATION</strong> mode.', 'demandbase_translation' ); ?></p></div>
	<?php endif;
	
    include('demandbase_howto_page.php');
}

/*
 * Loads up the entitlements ist page
 * 
 */
function demandbase_entitlements() {
	$db_settings = get_demandbase_settings();
	
	if(strlen($db_settings['api_key']) != 40): ?>
		<div class="error"><p><?php _e('Your Demandbase API key has <strong>NOT</strong> been set. You must set this to use the plugin!', 'demandbase_translation' ); ?></p></div>
	<?php endif; ?>
	
	<?php if(strlen($db_settings['api_key']) == 40 && $db_settings['simulation_active'] != 1): ?>
		<div class="updated"><p><?php _e('Your Demandbase plugin is configured properly and is in <strong>LIVE</strong> mode.', 'demandbase_translation' ); ?></p></div>
	<?php endif; ?>
	
	<?php if(strlen($db_settings['api_key']) == 40 && $db_settings['simulation_active'] == 1): ?>
		<div class="updated"><p><?php _e('Your Demandbase plugin is configured properly and is in <strong>SIMULATION</strong> mode.', 'demandbase_translation' ); ?></p></div>
	<?php endif;
	
    include('demandbase_entitlements_page.php');
}

/*
 * Add menu items in the WordPress admin backend
 * 
 */
function demandbase_admin_actions() {  
      add_menu_page("Demandbase", "Demandbase", 1, "demandbase", "demandbase_admin");
	  add_submenu_page("demandbase", "How To", "How To", 1, "demandbase-howto", "demandbase_howto");
	  add_submenu_page("demandbase", "Entitlements", "Entitlements", 1, "demandbase-entitlements", "demandbase_entitlements");
}

add_action('admin_menu', 'demandbase_admin_actions');

/*
 * Flatten multidimensional arrays
 * 		If we want a flattened PHP multidimensional array, we use this bad boy
 * 		This function will prefix the new keys with the subarray key
 * 
 * @return $result		A PHP flattened array of the values returned by the Demandbase servers
 */
function flatten($array, $prefix = '') {
    $result = array();
    foreach($array as $key=>$value) {
        if(is_array($value)) {
            $result = $result + flatten($value, $prefix . $key . '.');
        }
        else {
            $result[$prefix . $key] = $value;
        }
    }
    return $result;
}

/*
 * Magic happens here-
 * 		
 * 		This is the function that is called to access the Demandbase API and format/clean the returned JSON
 * 
 * 		THIS FLATTENS THE RESPONSE, BTW
 * 
 * @return $content		A PHP associative array of the values returned by the Demandbase servers
 */
function demandbase_get_response($return_blanks = FALSE, $get_entitlements = FALSE) {
	
	$db_settings = get_demandbase_settings();
	
	// Setting up an empty variable to store the IP in once we figure out which one we will be using
	$ip_to_use = '';
	
	// See if this call was to get the user's entitlements
	if(!$get_entitlements)
	{
		// If simulation mode is active, get the test ip address from database
		if($db_settings['simulation_active'] == 1)
		{
			if($db_settings['custom_ip_active'] == 1)
			{
				$ip_to_use = $db_settings['test_custom_ip'];
			} else {
				$ip_to_use = $db_settings['test_company_ip'];
			}
		}
		
		// Otherwise get visitor IP
		else {
			$ip_to_use = $_SERVER['REMOTE_ADDR'];			// Visitor IP address
		}
	} else {
		// Set to Demandbase's IP
		$ip_to_use = '50.59.18.196';
	}
	
	// Default Demandbase API URL
    $demandbase_url 	= 'http://api.demandbase.com/api/v2/ip.json';
    
    // Query string for the API GET
    $demandbase_args	= 'key='.$db_settings['api_key'].'&query='.$ip_to_use;
	
	// Response from the Demandbase API
    $demandbase_response = wp_remote_get( $demandbase_url.'?'.$demandbase_args );
    
	// Decode the reply into PHP accessible assoc. array
    $api_reply = json_decode($demandbase_response['body'], TRUE);
	
	$api_reply = flatten($api_reply);
	
	if(!$return_blanks)
	{
		// Check for empty/missing values in the cleaned and remove them - currently disabled
		foreach ($api_reply as $key => $value) {
			if($value == '' || $value == FALSE || !isset($value))
			{
				unset($api_reply[$key]);
			}
		}
	}
	
	// Send out what we worked so hard for
    return $api_reply;
}

/*
 * This function generates the shortcodes that can be used in posts and pages.
 * 		This shortcode is only for echoing out visitor information, not for wrapping content
 * 
 * @param $atts					// Attributes send by short code format
 * @return $response[$attr]		// Return the attribute requested in the API's response
 * 
 * To call shortcode:	[db_attribute attr="marketing_alias"]
 */
function demandbase_shortcodes( $atts ) {
	
	$response = demandbase_get_response();
		
	extract(shortcode_atts(array('attr' => ''), $atts ));

	return $response["{$attr}"];
}
add_shortcode( 'db_attribute', 'demandbase_shortcodes' );

/*
 * This function generates the shortcodes wrappers that can be used in posts and pages
 * 		This shortcode should only be used when targeting whole blocks of content
 * 
 * @param $atts					// Attributes send by shortcode format
 * @param $content				// The content inside the shortcode wrappers
 * @return $return_string		// Return the string enclosed in the shortcodes
 * 
 * To call shortcode:	[db_conditional industry="manufacturing,"]	This is the targeted content [/db_conditional]
 * 
 */
function db_sc_parser($atts, $content = null) {
	
	// Make some empty storage
	$return_content = '';
	$db_api_response = '';
	
	// If db_content_parser is found then work our magic
	if (shortcode_exists('db_conditional'))
	{
		// Make call to Demandbase API
		$db_api_response = demandbase_get_response();
		
		// Restructure comma-separated values into subarrays
		foreach ($atts as $attribute => $value)
		{
			// Remove all spaces from the $value
			$atts[$attribute] = str_replace(' ', '', $atts[$attribute]);
			$atts[$attribute] = strtolower(esc_html($atts[$attribute]));
			$atts[$attribute] = explode(',', $atts[$attribute]); // Split comma separated string into array
		}
		
		// Format Demandbase API response like we want
		foreach ($db_api_response as $attribute => $value)
		{
			// Escape HTML to match our $atts array values
			$db_api_response[$attribute] = strtolower(esc_html(str_replace(' ', '', $db_api_response[$attribute])));
		}
		
		$has_match_been_made = FALSE;
		
		// Now we check for matches and return the content if there's a match
		foreach($atts as $attr_key => $attr_value)
		{
			foreach ($attr_value as $key => $value) {
				
				// If it's a match
				if($value == $db_api_response[$attr_key])
				{
					$has_match_been_made = TRUE; // We found a match!
				}
			}
		}
		
		// If the string has not="not" in it, then omit the content when match has been made. Otherwise show it.
		if($has_match_been_made)
		{
			if($atts['not'][0] == 'not')
			{
				$return_content = '';
			} else {
				$return_content = $content;
			}
		} else {
			if($atts['not'][0] == 'not')
			{
				$return_content = $content;
			} else {
				$return_content = '';
			}
		}
	}
	
	// Send it out
	return do_shortcode($return_content);
}
add_shortcode( 'db_conditional', 'db_sc_parser' );

/**
 * Adds a box to the main column on the Post and Page edit screens for building Demandbase shortcodes
 */
function demandbase_add_custom_box() {

    $screens = array( 'post', 'page' );

    foreach ( $screens as $screen ) {

        add_meta_box(
            'demandbase_sectionid',
            __( 'Demandbase Shortcode Builder', 'demandbase_textdomain' ),
            'demandbase_shortcodes_dropdown',
            $screen
        );
        
    }
}
add_action( 'add_meta_boxes', 'demandbase_add_custom_box' );

/**
 * Prints the box content.
 * 
 * @param WP_Post $post The object for the current post/page.
 */
function demandbase_shortcodes_dropdown() {
    include('demandbase_shortcode_helper.php');
}


?>