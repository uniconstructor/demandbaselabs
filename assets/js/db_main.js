jQuery(document).ready(function() {
    
    // demandbase_sim_active_wrapper
    if(jQuery('#demandbase_sim_active').is(':checked'))
    {
        jQuery('#demandbase_sim_active_wrapper').show(0);
    } else {
        jQuery('#demandbase_sim_active_wrapper').hide(0);
    }
    
    jQuery('#demandbase_sim_active').on('change', function () {
        if(jQuery('#demandbase_sim_active').is(':checked'))
        {
            jQuery('#demandbase_sim_active_wrapper').stop().fadeIn(100);
        } else {
            jQuery('#demandbase_sim_active_wrapper').stop().fadeOut(100);
        }
    });
    
    
    if(jQuery('#demandbase_custom_ip_active').is(':checked'))
    {
        jQuery('#demandbase_custom_ip_wrapper').show(0);
        jQuery('#db_company_ip_toggle').hide(0);
    } else {
        jQuery('#demandbase_custom_ip_wrapper').hide(0);
        jQuery('#db_company_ip_toggle').show(0);
    }
    
    
    jQuery('#demandbase_custom_ip_active').on('change', function () {
        if(jQuery('#demandbase_custom_ip_active').is(':checked'))
        {
            jQuery('#db_company_ip_toggle').stop().fadeOut(100, function() {
                jQuery('#demandbase_custom_ip_wrapper').stop().fadeIn(100);
            });
        } else {
            jQuery('#demandbase_custom_ip_wrapper').stop().fadeOut(100, function() {
                jQuery('#db_company_ip_toggle').stop().fadeIn(100);
            });
        }
    });
    
    jQuery('html').on('click', '#db_insert_into_helper', function() {
        
        // Get the type of shortcode desired
        var selectedShortcodeType = jQuery('#db_shortcode_type_list').val();
        
        // Get the currently selected attribute
        var selectedAttribute = jQuery('#db_shortcode_dropdown_list').val();
        
        // Get the "not" toggler
        var isNot = jQuery('#db_not_selector').is(':checked') ? 'not="not"' : '';
        
        // Generate our shortcode
        var contentToAdd = '';
        
        if(jQuery.isEmptyObject(selectedAttribute))
        {
            alert('Please select attributes!');
        } else {
            if(selectedShortcodeType == 'attribute')
            {
                for (var i = 0; i < selectedAttribute.length; i++) {
                    contentToAdd += '[db_attribute attr="'+selectedAttribute[i]+'"]';
                }
                
            } else if(selectedShortcodeType == 'conditional') {
                
                contentToAdd = '[db_conditional ';
                
                for (var i = 0; i < selectedAttribute.length; i++) {
                    contentToAdd += selectedAttribute[i]+'="filter_1,filter_2" '+isNot+' ';
                }
                
                contentToAdd += ']YOUR CONDITIONAL CONTENT GOES IN HERE';
                contentToAdd += '[/db_conditional]';
            }
            
            // Check which editor is visible (TinyMCE or Textarea)
            var idToAppendTo = jQuery('#content').is(':visible') ? '#content' : '#tinymce';
            
            // Add our content to the textarea / TinyMCE
            if(idToAppendTo == '#tinymce')
            {
                tinyMCE.execInstanceCommand('content', "mceInsertContent", false, contentToAdd);
            } else {
                jQuery(idToAppendTo).val(jQuery(idToAppendTo).val() + contentToAdd);
            }
        }
        
    });
});