<div class="wrap">  
    <?php    echo "<h2>" . __( 'Demandbase Plugin How-To', 'demandbase_translation' ) . "</h2>"; ?>  
      
    <style type="text/css">
    	
    	code {
    		width: 100%; display: block; padding: 15px; margin: 7px 0; box-sizing: border-box;
    	}
    	
    </style> 
     
    <h2>Targeting Content</h2>
    
    <p>In this version of the Demandbase WordPress plugin, you can target page and post content by using shortcodes. Please click below to learn more about shortcodes.</p>
    <p><a href="http://codex.wordpress.org/Shortcode" target="_blank">http://codex.wordpress.org/Shortcode</a></p>
    
    <p>There are two methods for targeting content in this plugin. 
    	You can echo out visiting company attrbutes using a single shortcode (see 1. below). 
    	The other method is customizing whole blocks of page content using wrapping short codes. (See 2. below)</p>
    
    <h3>1. Echoing Visitor Attributes</h3>
    <p>Attribute shortcode format and usage:</p>
    <p>
    	<code>
			[db_attribute attr="marketing_alias"]
		</code>
		<strong>Example output: </strong>Demandbase
		<code>
			[db_attribute attr="hq.company_name"]
		</code>
		<strong>Example output: </strong>Demandbase Inc
	</p>
	<p>For a full list of attributes, see your entitlements page to the left.</p>
    
    <h3>2. Conditional Blocks</h3>
    <p>Conditional shortcode format and usage:</p>
    <p>
    	<code>
    		[db_conditional industry="Software &amp; Technology, manufacturing"]<br/>
			&nbsp;&nbsp;&nbsp;&nbsp;This content only shows up for the Software &amp; Technology or Manufacturing industries.<br/>
			[/db_conditional]
		</code>
		<strong>Example output: </strong>This content only shows up for the Software &amp; Technology or Manufacturing industries.
		
		<code>
    		[db_conditional not="not" industry="Software &amp; Technology, manufacturing"]<br/>
			&nbsp;&nbsp;&nbsp;&nbsp;This content only shows up when a visitor is not in the Software &amp; Technology or Manufacturing industries.<br/>
			[/db_conditional]
		</code>
		<strong>Example output: </strong>This content only shows up when a visitor is not in the Software &amp; Technology or Manufacturing industries.
		
	</p>
	<p>Please note that you may add as many criteria to each attribute as necessary by separating with commas.</p>
	
	<h3>3. Default Conditional Blocks</h3>
    <p>Conditional shortcode format and usage for default values:</p>
    <p>Due to the way WordPress parses shortcodes, in order to gain default bahavior, you must use the <strong>not="not"</strong> code and specify all of the values you target in every other shprtcode block. See the example below for clarification.</p>
    <p>
    	<code>
    		[db_conditional industry="manufacturing" marketing_alias="demandbase"]<br/>
			&nbsp;&nbsp;&nbsp;&nbsp;This content will show up for the manufacturing industry <strong>or</strong> for Demandbase.<br/>
			[/db_conditional]
			<br/><br/>
    		[db_conditional industry="Software &amp; Technology"]<br/>
			&nbsp;&nbsp;&nbsp;&nbsp;This content will show up for the Software &amp; Technology industry.<br/>
			[/db_conditional]
			<br/><br/>
    		[db_conditional not="not" industry="Software &amp; Technology, manufacturing" marketing_alias="demandbase"]<br/>
			&nbsp;&nbsp;&nbsp;&nbsp;This content only shows up when a visitor is not in the Software &amp; Technology or Manufacturing industries and is not with Demandbase.<br/>
			[/db_conditional]
		</code>
		
	</p>
	
	<h3>4. Nesting Attribute Short Codes in Conditional Blocks</h3>
    <p>Nesting rules:</p>
    <p>Due to the way WordPress parses shortcodes, you can <strong>only</strong> nest an attribute shortcode inside of a conditional shortcode. You <strong>cannot</strong> nest a conditional insite a conditional.</p>
    <p>
    	<code>
    		[db_conditional industry="Software &amp; Technology"]<br/>
			&nbsp;&nbsp;&nbsp;&nbsp;Welcome to our site, [db_attribute attr="company_name"]. We see that you have [db_attribute attr="employee_count"] employees.<br/>
			[/db_conditional]
		</code>
		<strong>Example output: </strong>Welcome to our site, Demandbase Inc. We see that you have 65 employees.
	</p>

</div>