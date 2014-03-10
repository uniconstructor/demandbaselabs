<div class="wrap">
    <?php    echo "<h2>" . __( 'Demandbase Plugin How-To', 'demandbase_translation' ) . "</h2>"; ?>

    <style type="text/css">

        code {
            width: 100%; display: block; padding: 15px; margin: 7px 0; box-sizing: border-box;
        }

    </style>

    <h2>Content Personalization and Targeting</h2>

    <p>The Demandbase WordPress plugin provides the ability to personalize and target site content based on a visitor's company profile.</p>

    <p> WordPress Shortcodes are used to display Demandbase company profile attributes within site copy or to conditionally show content blocks. </p>
    <p>To learn more about Shortcodes, visit: <a href="http://codex.wordpress.org/Shortcode" target="_blank">http://codex.wordpress.org/Shortcode</a></p>
<hr/>
    <p>
        There are two methods for displaying targeted/personalized content using this plugin:
        <ol>
            <li>Dynamically display company profile attribute values using a single Shortcode</li>
            <li>Wrap content in Shortcode conditions to only display content when the visitor's company profile satisfies a rule.</li>
        </ol>
    </p>

    <h3>1. Display Company Profile Attributes</h3>
    <p>Attribute Shortcode format and usage:</p>
    <p>
        <code>
            [db_attribute attr="industry"]
        </code>
        <strong>Example output: </strong>Software &amp; Technology
        <code>
            [db_attribute attr="company_name"]
        </code>
        <strong>Example output: </strong>Demandbase
    </p>
    <p>For a full list of attributes, see the Attributes page (under the Demandbase menu on the left).</p>
    <p>For an enumeration of values for attributes such as revenue range, employee range, industry and audience,
        visit the <a href="http://demandbaselabs.com/docs/wiki/index.php?title=Demandbase_API_Documentation" target="_blank">Demandbase API documentation</a> (login required).</p>

    <h3>2. Conditional Blocks</h3>
    <p>Conditional Shortcode format and usage:</p>
    <p>
        <code>
            [db_conditional industry="Software &amp; Technology, manufacturing"]<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;This content only shows up for the Software &amp; Technology <em>or</em> Manufacturing industries.<br/>
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
    <p>Please note that you may define as many criteria as necessary for each attribute by separating with commas.</p>
    <p>For a complete list of the available Company Profile attributes,
        see: <a href="http://demandbaselabs.com/docs/wiki/index.php?title=Demandbase_API_Documentation" target="_blank">Demandbase API documentation</a> (login required).
    </p>

    <h3>3. Default Conditional Blocks</h3>
    <p>Conditional Shortcode format and usage for default values:</p>
    <p>Due to the way WordPress parses Shortcodes, in order to define a default bahavior, you must use the
        <strong>not="not"</strong> code and specify all of the values you target in every other Shortcode block. See the example below for clarification.
    </p>
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
    <p>Due to the way WordPress parses Shortcodes, you can <strong>only</strong> nest an attribute Shortcode inside of a conditional Shortcode. You <strong>cannot</strong> nest a conditional inside a conditional.</p>
    <p>
        <code>
            [db_conditional industry="Software &amp; Technology"]<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;Welcome to our site, [db_attribute attr="marketing_alias"]. Check out our products for [db_attribute attr="audience"] companies.<br/>
            [/db_conditional]
        </code>
        <strong>Example output: </strong>Welcome to our site, Demandbase. Check out our products for SMB companies.
    </p>

</div>