import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import getOppo from '@salesforce/apex/oppoCloseDate.getOppo';


export default class Calandar extends LightningElement {
    //  @track eventData ;
  @track returnedOppo = [] ;
  @track finalOppo = [] ;


  renderedCallback() {
    Promise.all([
      loadScript(this, FullCalendarJS + '/FullCalendarJS/jquery.min.js'),
      loadScript(this, FullCalendarJS + '/FullCalendarJS/moment.min.js'),
      loadScript(this, FullCalendarJS + '/FullCalendarJS/fullcalendar.min.js'),
      loadStyle(this, FullCalendarJS + '/FullCalendarJS/fullcalendar.min.css'),
      // loadStyle(this, FullCalendarJS + '/fullcalendar.print.min.css')
    ])
    .then(() => {
      // Initialise the calendar configuration
      console.log('scriptloaded');
      this.getTasks();
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error({
        message: 'Error occured on FullCalendarJS',
        error
      });
    })
  }
  initialiseFullCalendarJs() {
   // console.log(window.location.href);
    console.log('In nitial');
    console.log(this.returnedOppo.length);
    console.log('In initial');
    var str = window.location.href;
    //console.log(str.left());
    var pos = str.indexOf(".com/");
    var last = pos + 4;
    var tDomain = str.slice(0,last);
    for(var i = 0 ; i < this.returnedOppo.length ; i++)
    {
      this.finalOppo.push({
        start : this.returnedOppo[i].CloseDate,
        title : this.returnedOppo[i].Name,
        url : tDomain+'/lightning/r/Opportunity/'+this.returnedOppo[i].Id+'/view'
    });
    }
    console.log(this.finalOppo.length);
    console.log('Final Task Length Above');
    const ele = this.template.querySelector('div.fullcalendarjs');
    // eslint-disable-next-line no-undef
    $(ele).fullCalendar({
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
      },
     // defaultDate: '2020-03-12',
      defaultDate: new Date(), // default day is today
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events : this.finalOppo
    });
  }
  getTasks(){
    getOppo()
        .then(result =>{
           console.log(JSON.parse(result));
           this.returnedOppo = JSON.parse(result) ;
            console.log('Object Returned');
            this.initialiseFullCalendarJs();
            this.error = undefined;
        })
        .catch(error => {
            console.log(error);
            console.log('error');
            this.error = error;
            this.outputResult = undefined;
        });
  }
    }
