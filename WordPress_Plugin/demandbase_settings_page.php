<div class="wrap">
    <?php    echo "<h2>" . __( 'Demandbase Settings', 'demandbase_translation' ) . "</h2>"; ?>
	
	<?php if($_POST['demandbase_hidden'] == 'true'): // Check for POST of our hidden field ?>

		<?php
			
	        //Form data sent
	        $posted_demandbase_api_key 				= $_POST['demandbase_api_key'];
            $posted_demandbase_sim_active			= $_POST['demandbase_sim_active'];
			$posted_demandbase_company_ip		 	= $_POST['demandbase_company_ip'];
            $posted_demandbase_custom_ip_active		= $_POST['demandbase_custom_ip_active'];
			$posted_demandbase_custom_ip			= $_POST['demandbase_custom_ip'];

            /*
             * Begin cleaning the data before sending to database
             */

            // API Key
            $posted_demandbase_api_key = (strlen($posted_demandbase_api_key) == 40) ? $posted_demandbase_api_key : '';

            // Is simulation mode active?
            $posted_demandbase_sim_active = ($posted_demandbase_sim_active == 1) ? 1 : 0;

            // Does the company IP have the correct number of characters?
            if(strlen($posted_demandbase_company_ip) < 6 || strlen($posted_demandbase_company_ip) > 16)
            {
                $posted_demandbase_company_ip = '';
            }
                
            // Is custom IP mode active?
            $posted_demandbase_custom_ip_active = ($posted_demandbase_custom_ip_active == 1) ? 1 : 0;

            // Does the custom IP have the correct number of characters?
            if(strlen($posted_demandbase_custom_ip) < 6 || strlen($posted_demandbase_custom_ip) > 16)
            {
                $posted_demandbase_custom_ip = '';
            }
            
			// Submit values to database
	        update_option('demandbase_api_key', 	$posted_demandbase_api_key);
			update_option('demandbase_company_ip', 	$posted_demandbase_company_ip);
			update_option('demandbase_sim_active', 	$posted_demandbase_sim_active);
			update_option('demandbase_custom_ip_active', 	$posted_demandbase_custom_ip_active);
			update_option('demandbase_custom_ip', 	$posted_demandbase_custom_ip);
			
			// Set a flash message
			$flash_message = 'Your changes have been updated. You will be redirected.';
			
			$javascript = '<script>setTimeout(function () { window.location.href = "'.$_SERVER['REQUEST_URI'].'"; }, 1000); </script>';
		
			echo $javascript;
		
		?>
		
		<div class="updated"><p><?php _e($flash_message, 'demandbase_translation' ); ?></p></div>
		
    <?php else: ?>
   

		<style type="text/css">
			
			label {
				display: inline-block;
				width: 30%;
			}
			
		</style>
		
		<?php if($db_settings['simulation_active'] == 1 && $db_settings['custom_ip_active'] == 0 && $db_settings['test_company_ip'] == ''): ?>
			<div class="error"><p><?php _e('You must select a company to simulate!', 'demandbase_translation' ); ?></p></div>
		<?php elseif($db_settings['simulation_active'] == 1 && $db_settings['custom_ip_active'] == 1 && $db_settings['test_custom_ip'] == ''): ?>
			<div class="error"><p><?php _e('You must enter an IP to simulate!', 'demandbase_translation' ); ?></p></div>
		<?php endif; ?>
		      
		    <form name="demandbase_settings_form" method="post" action="<?php echo str_replace( '%7E', '~', $_SERVER['REQUEST_URI']); ?>">  
		        <input type="hidden" name="demandbase_hidden" value="true">
		        
		        <?php echo "<h4>" . __( 'API Configuration', 'demandbase_translation' ) . "</h4>"; ?>
		        
		        <p>
		        	<label for="demandbase_api_key"><?php _e('Demandbase API Key: ', 'demandbase_translation'); ?></label>
		        	<input type="text" id="demandbase_api_key" name="demandbase_api_key" value="<?php echo $db_settings['api_key']; ?>" size="40" maxlength="40">
		        	You must enter your API key to use Demandbase
		        </p>
                    
                <p>
                    <label for="demandbase_sim_active"><?php _e('Enable simulation mode: ', 'demandbase_translation'); ?></label>
                    <input type="checkbox" name="demandbase_sim_active" id="demandbase_sim_active" value="1" <?php echo ($db_settings['simulation_active']) ? 'checked="checked"' : '' ?> />
                    <label for="demandbase_sim_active"><?php echo ($db_settings['simulation_active']) ? 'Simulation mode is <strong>ACTIVE</strong>' : 'Simulation mode is <strong>NOT ACTIVE</strong>' ?></label>
                </p> 
                
                <div id="demandbase_sim_active_wrapper">
                    
                    <p>
                        <label for="demandbase_custom_ip_active"><?php _e('Use my own test IP address: ', 'demandbase_translation'); ?></label>
                        <input type="checkbox" name="demandbase_custom_ip_active" id="demandbase_custom_ip_active" value="1" <?php echo ($db_settings['custom_ip_active']) ? 'checked="checked"' : '' ?> />
                        <label for="demandbase_custom_ip_active"><?php echo ($db_settings['custom_ip_active']) ? 'Custom IP mode is <strong>ACTIVE</strong>' : 'Custom IP mode is <strong>NOT ACTIVE</strong>' ?></label>
                    </p>
                    
                    <p id="db_company_ip_toggle">
                        <label for="demandbase_company_ip"><?php _e('Select company to simulate: ', 'demandbase_translation'); ?></label>
                        
                        <select id="demandbase_company_ip" name="demandbase_company_ip">
                            <option value="">Please select an option</option>
                            <option value="50.59.18.196" 	<?php echo ($db_settings['test_company_ip'] == '50.59.18.196') ? 'selected="selected"' : '' ?>>Demandbase, Inc (Software &amp; Technology => Software Applications)</option>
                            <option value="4.18.62.1" 		<?php echo ($db_settings['test_company_ip'] == '4.18.62.1') ? 'selected="selected"' : '' ?>>East West Bank (Financial Services => Banking &amp; Finance)</option>
                            <option value="4.21.101.1"		<?php echo ($db_settings['test_company_ip'] == '4.21.101.1') ? 'selected="selected"' : '' ?>>AFIP (Healthcare &amp; Medical => Providers))</option>
                            <option value="4.20.98.65"		<?php echo ($db_settings['test_company_ip'] == '4.20.98.65') ? 'selected="selected"' : '' ?>>Williams-Sonoma (Furniture => Retail)</option>
                            <option value="3.0.0.1"			<?php echo ($db_settings['test_company_ip'] == '3.0.0.1') ? 'selected="selected"' : '' ?>>General Electric (Manufacturing => Industrial)</option>
                            <option value="212.125.84.152"	<?php echo ($db_settings['test_company_ip'] == '212.125.84.152') ? 'selected="selected"' : '' ?>>Ski Class (Financial Services => Banking &amp; Finance)</option>
                            <option value="12.131.200.224"	<?php echo ($db_settings['test_company_ip'] == '12.131.200.224') ? 'selected="selected"' : '' ?>>Adobe (Software &amp; Technology => Software Applications)</option>
                        </select>
                        
                        Please select a company to simulate or enter your own IP below
                    </p> 
                    
                    <div id="demandbase_custom_ip_wrapper">
                    
                        <p>
                            <label for="demandbase_custom_ip"><?php _e('Test IP Address: ', 'demandbase_translation'); ?></label>
                            <input type="text" id="demandbase_custom_ip" name="demandbase_custom_ip" value="<?php echo $db_settings['test_custom_ip']; ?>" size="40" maxlength="15">
                            Use this if you want to simulate an IP address.
                        </p>
                        
                    </div>
                    
                </div>
		        
		        <hr />
		      
		        <p class="submit">  
					<input type="submit" name="Submit" value="<?php _e('Save Changes', 'demandbase_translation' ) ?>" />  
		        </p>  
		    </form>
		
	<?php endif; ?>
	
</div>