

document.addEventListener("deviceready", onDeviceReady, false);
var jobID;
var xml_all;
var detailed_div;
var image_array=new Array();
preload([
                        'css/ikoner/info_blue.png',
                        'css/ikoner/info_dark.png',
                        'css/ikoner/jobs_blue.png',
                        'css/ikoner/jobs_dark.png',
                        'css/ikoner/settings_blue.png',
                        'css/ikoner/settings_dark.png',
                        'css/ikoner/tips_blue.png',
                        'css/ikoner/tips_dark.png',
                        'css/images/ajax-loader.gif',
                        'css/images/filter.png',
                        'css/images/refresh.png'

                        ]);

function checkConnection() {

if(!navigator.onLine)
{
navigator.notification.alert(
'Du måste vara ansluten till internet för att se denna del av applikationen', // message
alertDismissed, // callback
'Ingen internetanslutning', // title
'OK' // buttonName
);
}
}
//Om det inte går att hämta xml
function errorMessage(error)
{
navigator.notification.alert(
'Du måste vara ansluten till internet för att se denna del av applikationen', // message
alertDismissed, // callback
'Ingen internetanslutning', // title
'OK' // buttonName
);
}
function alertDismissed()
{
$('#spinner').show();
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
                          $('<img/>')[0].src = this;
                          });
}

$(document).on('pageinit',"body",function()
           {
                detailed_div=$("div#detailed_job_content ul");
                
           
           
           });


function refresh()
{
  var jobs_div = $('div#jobs_content ul#job');
                  jobs_div.text('');
                  $.ajax({
                         type: "GET",
                         url: "http://cv.skill.se/cv/rss.jsp?format=mtrxml&allads=1&fullad=1",
                         dataType: "xml",
                         success: parseXml
                         });


                  function parseXml(xml)
                  {
                  xml_all=xml;
                  $(xml).find("job").each(function()
                                               {  
                                                    var link = $(this).find('applicationMethods link').attr('href');
                                                    var img = $(this).find('logo link').attr('href');
                                                    image_array.push(img);
                                                    var title = $(this).find('title').text();
                                                    var id = $(this).attr('id');
                                                    var date = $(this).find('pubDate').text();
                                                    var location = $(this).find('location').text();
                                                    var area = $(this).find('area').text();
                                                    var assignment_type = $(this).find('assignmentType').text();
                                                     $('div#jobs_content ul#job').append('<li class="listelement" data-id= "' + id + '" ><a><img src="' + img +'" class="ui-li-thumb"><p class="ui-li-heading">' + title + '</p><p class="ui-li-desc">'+area+','+assignment_type+'<br></br>' +location+', '+date+'</p></a></li>');
                                                });
                  $('div#jobs_content ul#job').listview("refresh");
                  preload(image_array);
                  
                  $('li.listelement').click(function(){
                                          jobID = $(this).data('id');

                                          detailed_div.text('');
                                          job_id = $(this).data('id');
                                          var detailed_job = $(xml_all).find("job[id="+job_id+"]");
                                          var detailed_title = detailed_job.find('title').text();
                                          var detailed_company = detailed_job.find('company name').text();
                                          var detailed_area = detailed_job.find('area').text();
                                          var detailed_assignment_type = detailed_job.find('assignmentType').text();
                                          var detailed_location = detailed_job.find('location').text();
                                          var detailed_description = detailed_job.find('description').text();
                                          var detailed_img = detailed_job.find('logo link').attr('href');
                                          var detailed_link = detailed_job.find('applicationMethods link').attr('href');
                                          $('#detailed_job_view div.header h1').html(detailed_company);
                                          detailed_div.append('<h1 id="job_title">'+detailed_title+'</h1>');
                                          detailed_div.append('<img src="' + detailed_img +'" id="job_image"></img>');

                                          detailed_div.append('<table>');
                                          detailed_div.append('<tr>');
                                          detailed_div.append('<td> Arbetsgivare </td> ');
                                          detailed_div.append('<td>' +detailed_company+ '</td>');
                                          detailed_div.append('</tr>');
                                          detailed_div.append('<tr>');
                                          detailed_div.append('<td> Uppdragstyp </td>');
                                          detailed_div.append('<td>' +detailed_assignment_type+ '</td>');
                                          detailed_div.append('</tr>');
                                          detailed_div.append('<tr>');
                                          detailed_div.append('<td> Område </td>');
                                          detailed_div.append('<td>' +detailed_area+ '</td>');
                                          detailed_div.append('</tr>');
                                          detailed_div.append('<tr>');
                                          detailed_div.append('<td> Ort </td>');
                                          detailed_div.append('<td>' +detailed_location+ '</td>');
                                          detailed_div.append('</tr>');
                                          detailed_div.append('<tr>');
                                          detailed_div.append('<td> Platser </td>');
                                          detailed_div.append('<td> 2 </td>');
                                          detailed_div.append('</tr>');
                                          detailed_div.append('<tr>');
                                          detailed_div.append('<td> Sista ansökningsdagen </td>');
                                          detailed_div.append('<td> 2013-06-28 </td>');
                                          detailed_div.append('</tr>');
                                          detailed_div.append('</table>');
                                          detailed_div.append('<hr/>');

                                          detailed_div.append('<div id="description">'+detailed_description+'</div>');
                                          detailed_div.append('<hr/>');
                                          detailed_div.append('<a data-role="button" id="job_link">Ansök</a>');

                                          $.mobile.changePage("#detailed_job_view",{ transition: "none"});
                                           
                                           
                                });
                  
                  
                  
      }


}



function onDeviceReady() {

    //checkConnection();
    //Get the xml from the web.
    
    //Remove the SplashScreen!!
     navigator.splashscreen.hide();

     
}
$(document).on('pagebeforeshow', "#jobs", function()
                  {
                    preload(image_array);
                     if(!xml_all)
                  {
                  refresh();
                  }
                  

                  
});

$(document).on('pagebeforeshow', '#detailed_job_view', function()
{


  $('#detailed_job_view').trigger("create");

  $('a#job_link').live("click", function()
    {
        ref = window.open(link,'_blank', 'location=no');
    });
    $("div#detailed_job_content").iscrollview("refresh");
    $("div#detailed_job_content").iscrollview("scrollTo", 0, 0, 0, false);
    
    $('div#description a').click(function(event)
                                            {
                                            
                                            var anchor_text = $(this).text();
                                            var charExists = (anchor_text.indexOf('@') >=0);
                                            if(!charExists)
                                            {
                                                event.preventDefault();
                                            }
                                            
                                            });                     
                           
});





$(document).on('pageinit', "#about", function()
                  {
                    
                  $.ajax({
                         type: "GET",
                         url: "http://pervelander.se/examensarbete/xml/about.xml",
                         dataType: "xml",
                         success: readAboutXml,
                         timeout:4000,
                         });


                  function readAboutXml(xml)
                  {
                    var title = $(xml).find('about title').text();
                    var paragraph = $(xml).find('about paragraph').text();

                    $('div#about_content ul').html("<h3>"+title+"</h3><br></br><p>"+paragraph+"</p>");
                    
                  }

                  $("div#about_content").iscrollview("refresh");    

                });

$(document).on('pageinit', "#tips", function()
                  {
                    
                  $.ajax({
                         type: "GET",
                         url: "http://pervelander.se/examensarbete/xml/tips.xml",
                         dataType: "xml",
                         success: readAboutXml,
                         timeout:4000,
                         });


                  function readAboutXml(xml)
                  {
                    var title = $(xml).find('tips title').text();
                    var paragraph = $(xml).find('tips paragraph').text();

                    $('div#tips_content ul').html("<h3>"+title+"</h3><br></br><p>"+paragraph+"</p>");
                    
                  }

                  $("div#tips_content").iscrollview("refresh");    

                });




var app = {
    // Application Constructor
initialize: function() {
    this.bindEvents();
},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
onDeviceReady: function() {
    app.receivedEvent('deviceready');
},
tokenHandler:function(msg) {
    
    var prenums = new Array();
    prenums.push("Östergötlands län");
    prenums.push("Teknik/data");
    prenums.push("Hyrrekrytering");
    
    $.ajax({
        type: 'POST',
        data: {"device_token":msg,"prenum_array":prenums} ,
        url: 'http://pervelander.se/examensarbete/post_prenum_ios.php',
        success: function(data){
           console.log(data);
           alert('Your comment was successfully added');
        },
        error: function(){
           console.log(data);
           alert('There was an error adding your comment');
        }
    });

    console.log("Token Handler " + msg);
    //alert(msg);
},
errorHandler:function(error) {
   
},
    // result contains any message sent from the plugin call
successHandler: function(result) {
    
},
    // Update DOM on a Received Event
receivedEvent: function(id) {
    var pushNotification = window.plugins.pushNotification;
    // TODO: Enter your own GCM Sender ID in the register call for Android
    if (device.platform == 'android' || device.platform == 'Android') {
        pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"1011544002093","ecb":"app.onNotificationGCM"});
    }
    else {
        pushNotification.register(this.tokenHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
    }
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
    
    console.log('Received Event: ' + id);
},
    // iOS
onNotificationAPN: function(event) {
    var pushNotification = window.plugins.pushNotification;
    console.log("Received a notification! " + event.alert);
    console.log("event sound " + event.sound);
    console.log("event badge " + event.badge);
    console.log("event " + event);
    if (event.alert) {
        navigator.notification.alert(event.alert);
    }
    if (event.badge) {
        console.log("Set badge on  " + pushNotification);
        pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
    }
    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }
},
    // Android
onNotificationGCM: function(e) {
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
              var prenums = new Array();
          prenums.push("Östergötlands län");
          prenums.push("Teknik/data");
          prenums.push("Hyrrekrytering");
          
          $.ajax({
              type: 'POST',
              data: {"device_token":e.regid,"prenum_array":prenums} ,
              url: 'http://pervelander.se/examensarbete/post_prenum_android.php',
              success: function(data){
                 console.log(data);
                 
              },
              error: function(){
                 console.log(data);
                 
              }
          });
              
              //alert(e.regid);
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                //alert('registration id = '+e.regid);
            }
            break;
            
        case 'message':
            // this is the actual push notification. its format depends on the data model
            // of the intermediary push server which must also be reflected in GCMIntentService.java
            
            break;
            
        case 'error':
            
            break;
            
        default:
            
            break;
    }
}};
