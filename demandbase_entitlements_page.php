<div class="wrap">  
    <?php    echo "<h2>" . __( 'Your Demandbase Entitlements', 'demandbase_translation' ) . "</h2>"; ?>  
      
    <h3>About Entitlements</h3>
    
    <p>Entitlements are part of your contract with Demandbase, Inc. They can <strong>ONLY</strong> be changed by contacting your representative.</p>
    
	<h3>Your Entitlements</h3>
	
	<?php
		$entitlements = demandbase_get_response(TRUE, TRUE);
		
		foreach ($entitlements as $entitlement_k => $entitlement_v) {
			echo '<code>'.$entitlement_k.'</code><br />';
		}
	?>
</div>