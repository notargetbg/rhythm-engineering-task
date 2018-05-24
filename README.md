# rhythm-engineering-task
### Reporting Dashboard for Arizona State Crashes 2016 - built with react.js and d3.js

Thanks for giving me the chance and time to tackle this interesting and challenging task.

### How to run:
Run `npm install` inside the main directory, then run `npm run start` in order to start webpack server OR `npm run build` in order to do a dev build.
<hr>

#### Some insights:
All `<***Chart />` components accept a *data* prop and draw the chart based on that. On 2 occasions I needed to mutate the raw data in order to 
transform days and years *date objects* from *strings*. Charts also accept handleAddSummary *func* in order to send data to the *Redux Store* connected in `<ChartContainer />`.

I've created `<SummaryTable />` which renders a summary of the table data that is used by a chart we click on. You can also clear the summary by clicking on the *x* icon.



#### You can see a working demo of the dashboard here:
- [Rhythm-Dashboard Live Demo](http://rhythm-dashboard.designscaster.com/)

<hr>

Thank you! :)
