<div class="wrap">
    <?php    echo "<h2>" . __( 'Demandbase Company Profile Attributes', 'demandbase_translation' ) . "</h2>"; ?>

    <h3>About Company Profile Attributes</h3>

    <p>The Company Profile attributes provided by Demandbase are configured for your Demandbase Content Module key.  To add or remove attributes, contact your Customer Success Manager or Demandbase Support. </p>
    <p>If you have setup Account Watch, your custom fields will show here.</p>

    <h3>Available Attributes</h3>

    <?php
        $entitlements = demandbase_get_response(TRUE, TRUE);
        if(!is_null($entitlements)) {
            foreach ($entitlements as $entitlement_k => $entitlement_v) {
                echo '<code>'.$entitlement_k.'</code><br />';
            }
        }

    ?>
</div>