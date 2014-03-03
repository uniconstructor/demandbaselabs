<style type="text/css">
    .db_helper_wrapper {
        overflow: hidden;
    }
    
    .db_sc_box {
        box-shadow: 0 0 1px 0px #000 inset;
        width: 23%;
        height: 130px;
        float: left;
        padding: 10px 1%;
        margin-bottom: 5px;
        text-align: center;
    }
</style>

<?php $entitlements = demandbase_get_response(TRUE, TRUE); ?>

<div class="db_helper_wrapper">
    
    <p><strong>Instructions:</strong> To insert Demandbase content into your pages and posts, please select the type of shortcode you want to insert. After you have selected this, click on the attributes you want to specify (hold CTRL and click (on PC) or CMD + click (on Mac) to select multiple). Please visit the &quot;How To&quot; to page in the Demandbase menu for more information on how these work.</p>
    
    <div class="db_sc_box">
        <label for="db_shortcode_type_list">Shortcode Type: </label>
        <select id="db_shortcode_type_list">
            <option value="attribute">Attribute</option>
            <option value="conditional">Conditional</option>
        </select>
    </div>
    
    <div class="db_sc_box">
        <label for="db_shortcode_dropdown_list">Attributes: </label>
        <select id="db_shortcode_dropdown_list" multiple>
            <?php foreach($entitlements as $entitlement_k => $entitlement_v): ?>
                <option value="<?php echo $entitlement_k; ?>"><?php echo $entitlement_k; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    
    <div class="db_sc_box">
        <label for="db_not_selector">NOT: <input type="checkbox" id="db_not_selector"></label>
    </div>
    
    <div class="db_sc_box">
        <button type="button" id="db_insert_into_helper">Insert shortcode into page/post &gt;</button>
    </div>

</div>