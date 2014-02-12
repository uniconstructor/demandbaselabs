#Demandbase / Optimizely Integration
This basic HTML file demonstrates how to use the [Demandbase JavaScript SDK](https://gist.github.com/demandbaselabs/8365109) with Optimizely.

There are two ways to use Demandbase within Optimizely.
1. Trigger an Optimizely Experiment based on a Demandbase Segment
2. Place a visitor in an Optimizely Visitor Segment based on a Demandbase Segment

#Prerequisites
1. Install the Optimizely tracking code as instructed in the 'Implementation' tab in Optimizely
2. Configure and install the [Demandbase JS SDK](https://gist.github.com/demandbaselabs/8365109)
  * Your Demandbase Solutions Consultant will assist you with this step.

#Trigger an Optimizely Experiment
Triggering an Optimizely Experiment using Demandbase allows you to personalize and target website content based on a visitor's company profile.
Multiple experiments can be setup and triggered according to various Demandbase Segments.  This works best when the Demandbase Segments do not overlap.

1. Create a new experiment with at least one variation
2. Under the Options menu, select **Targeting**, then select *Satisfy this custom JavaScript condition*.
  * Place a reference to a Demandbase Segment in the text box.  For example: `Demandbase.Segments.AudienceIsSMB`.
  * See your Demandbase code for your configured Demandbase Segments.
3. Set the activation mode to 'Manual'
4. Place the experiment activation code within the Demandbase callback function
  * Example:
  ```
  __db.callback = function(company) {
    window.optimizely = window.optimizely || [];
    window.optimizely.push(['activate', 'EXPT_ID_HERE']);
  };
  ```
5. *Optional:* Adjust the Traffic Allocation in Optimizely to use the variation more frequently.

#Create Optimizely Visitor Segments
Optimizely Visitor Segments allow you to dissect the results of an experiment based on visitor attributes.  This feature is only available in [Optimizely Platinum](https://www.optimizely.com/pricing).

1. Create a new Visitor Segment.
2. Select *Satisfy this custom Javascript condition**
3. Place a reference to a Demandbase Segment in the text box.  For example: `Demandbase.Segments.AudienceIsSMB`.
  * See your Demandbase code for your configured Demandbase Segments.
4. To use your Visitor Segment, view the results of an experiment, then select your Custom Segment from the menu on the left.