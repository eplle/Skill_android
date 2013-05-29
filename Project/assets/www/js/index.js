

document.addEventListener("deviceready", onDeviceReady, false);






var xml_all;

var detailed_div;
var image_array=new Array();
var device_token;
var detailed_link;
var db = window.localStorage;
var settings_array = new Array();
var push_boolean;
var job_id;

var detailed_job;
var detailed_title;
var detailed_company;
var detailed_area;
var detailed_assignment_type;
var detailed_location;
var detailed_description;
var detailed_img;
var detailed_positions;
var detailed_job_link;


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
                        'css/images/facebook.png',
                        'css/images/twitter.png',
                        'css/images/email.png'

                        ]);

function quitApplication(button_nr)
{
  if(button_nr==2)
  {
    navigator.app.exitApp();
  }
}

function backButtonClick(){
    if($.mobile.activePage.is('#jobs') || $('#first_time_welcome').is(":visible")){
      
      navigator.notification.confirm(
      'Detta avslutar applikationen', // message
      quitApplication, // callback
      'Avsluta', // title
      'Avbryt, OK' // buttonName
      );
        
    }
    else if($('#first_time_placement').is(":visible"))
    {
      $('#first_time_placement').hide();
      $('#first_time_welcome').show();
    }

    else if($('#first_time_area').is(":visible"))
    {
      $('#first_time_area').hide();
      $('#first_time_placement').show();

    }

    else if($('#first_time_assignment_type').is(":visible"))
    {
      $('#first_time_assignment_type').hide();
      $('#first_time_area').show();

    }

    else
    {
      navigator.app.backHistory();
    }

}



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
setTimeout(function() { $("#spinner").hide(); }, 5000);
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
                          $('<img/>')[0].src = this;
                          });
}




function refreshJobs()
{
  var jobs_div = $('div#jobs_content ul#job');
                  jobs_div.text('');
                  $.ajax({
                         type: "GET",
                         url: "http://skill.se/rss/jobs.xml",
                         dataType: "xml",
                         success: parseXml,
                         error: errorMessage
                         });


                  function parseXml(xml)
                  {
                    $('#refresh_jobs').hide();
                    xml_all=xml;
                            $(xml).find("item").each(function()
                                                         {  
                                                              
                                                              var img = $(this).find('small_logo').text();
                                                              var imgAsData = document.createElement("canvas").toDataURL(img);
                                                              
                                                              image_array.push(img);
                                                              var title = $(this).find('title').text();
                                                              var id = $(this).find('job_id').text();
                                                              var date = $(this).find('pubDate').text();
                                                              var location = $(this).find('city').text();
                                                              var area = $(this).find('field').text();
                                                              var assignment_type = $(this).find('assignment').text();
                                                               $('#job_ul').append('<li class="listelement" data-id= "' + id + '" ><a><img src="' + img +'" class="ui-li-thumb"><p class="ui-li-heading">' + title + '</p><p class="ui-li-desc">'+area+','+assignment_type+'<br></br>' +location+', '+date+'</p></a></li>');
                                                          });
                            $('#job_ul').listview("refresh");
                            preload(image_array);
                            
                            $('li.listelement').click(function(){
                                                    

                                                    
                                                    job_id = $(this).data('id');
                                                    
                                                    $.mobile.changePage("#detailed_job_view",{ transition: "none"});
                                                     
                                                     
                                          });
                            
                            
                            
                
    }


}



function onDeviceReady() {

    document.addEventListener("backbutton", backButtonClick, false);

    detailed_div=$("div#detailed_job_content ul");


                // $.mobile.loadPage('#settings');
                // $.mobile.loadPage('#about');
                // $.mobile.loadPage('#tips');
                if(!((settings_array = JSON.parse(db.getItem("settings"))) || (push_boolean = db.getItem("push_boolean"))))
                  {
                    $.mobile.changePage("#first_time_view",{ transition: "none"});
                    $('#spinner').hide();
                  }
                  else
                  {
                    $.mobile.changePage("#jobs", {transition: "none"});
                    $('#spinner').hide();
                  }

                if($.mobile.loadPage('#first_time_view'))
                {
                  // //Remove the SplashScreen!!
                      setTimeout(function() {
                      navigator.splashscreen.hide();
                    }, 1000);
                }

     
}
$(document).on('pageinit', "#jobs", function()
                  {
                  preload(image_array);

                  refreshJobs();
             

                  $('#refresh_jobs').mouseup(function()
                  {
                    refreshJobs();
                  });
                  
});

$(document).on('pagebeforeshow', '#detailed_job_view', function()
{

                                          detailed_div.text('');
                                          detailed_job = $(xml_all).find('item  job_id:contains("'+job_id+'")').parent();
                                          detailed_title = detailed_job.find('title').text();
                                          detailed_company = detailed_job.find('employer').text();
                                          detailed_area = detailed_job.find('field').text();
                                          detailed_assignment_type = detailed_job.find('assignment').text();
                                          detailed_location = detailed_job.find('city').text();
                                          detailed_description = detailed_job.find('content\\:encoded, encoded').text();
                                          detailed_img = detailed_job.find('small_logo').text();
                                          detailed_positions = detailed_job.find('positions').text();
                                          detailed_job_link = detailed_job.find('link').text();

                                          detailed_link = detailed_job.find('applicationMethods link').attr('href');
                                          $('h1#company_name').html(detailed_company);
                                          detailed_div.append('<h1 id="job_title">'+detailed_title+'</h1><img src="' + detailed_img +'" id="job_image"></img><table><tr><td> Arbetsgivare </td><td>' +detailed_company+ '</td></tr><tr><td> Uppdragstyp </td><td>' +detailed_assignment_type+ '</td></tr><tr><td> Område </td><td>' +detailed_area+ '</td></tr><tr><td> Ort </td><td>' +detailed_location+ '</td></tr><tr><td> Platser </td><td>'+detailed_positions+'</td></tr></table><hr/><div id="description">'+detailed_description+'</div><div id="share_div"><img id="facebook_link" src="css/images/facebook.png"/><img id="twitter_link" src="css/images/twitter.png"/><a href="mailto:?subject=Tips om ett ledigt jobb: '+detailed_title+'&body='+detailed_job_link+'data-url="http://skill.se" data-lang="sv" data-count="none" data-hashtags="skill"><img id="mail_link" src="css/images/email.png"/></a></div><hr/><a data-role="button" id="job_link">Ansök</a>');

  $('#detailed_job_view').trigger("create");

$('#facebook_link').click(function(){

      var fb_ref = window.open(encodeURI('https://www.facebook.com/dialog/feed?app_id=587758617909778&link='+detailed_job_link+'/&picture=http://skill.se/millnet/logo-facebook-app.png&name='+detailed_title+'&description=Ett ledigt jobb på: '+detailed_company+'&redirect_uri=http://skill.se/'),'_blank', 'location=no');

});

$('#twitter_link').click(function(){
var twitter_ref = window.open('https://twitter.com/intent/tweet?text='+encodeURI('Ledigt jobb: '+detailed_title+': ')+detailed_job_link+escape(' #skilligt #nyttjobb'), '_blank', 'location=no');

});

$('a#job_link').mousedown(function(){

                                     var ref = window.open('http://cv.skill.se/cv/assignment.jsp?id='+job_id+'&action=&previewcode=&tc=xml&i18nl=sv&i18nc=SE&i18nv=SKILL'+'&skillapp','_blank', 'location=no');
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


                                            $('#detailed_job_content img').load(function()
                                                   {
                                                   
                                                   $('#detailed_job_content').iscrollview("refresh");
                                                   });                 
                           
});

$(document).on('pageinit', "#settings", function()
                  {


              if((settings_array = JSON.parse(db.getItem("settings"))) && (push_boolean = db.getItem("push_boolean")))
                {
                  if(push_boolean=="false")
                  {
                    $('#settings #slider').val('off');
                    $('#settings #slider').slider("refresh");
                    
                  }
                  
                }
                  $('#settings').trigger("create");
                    $('#save_settings').mouseup(function()
                    {
                      $(this).addClass('ui-btn-down-g');

                      
                      if($('#settings #slider').val()=="on")
                      {
                        push_boolean = true;
                        settings_array = $('input:checkbox:checked.checkbox_group').map(function () 
                        {
                                        return this.value;
                        }).get();
                      
                      }
                      else
                      {

                        push_boolean = false;
                        settings_array = new Array();
                      }
                      if(device_token.length>0)
                      {
                          $.ajax({
                              type: 'POST',
                              data: {"device_token":device_token,"prenum_array":settings_array} ,
                              url: 'http://pervelander.se/examensarbete/post_prenum_android.php',
                              success: function(data){
                                 
                                $(this).removeClass('ui-btn-down-g');
                                navigator.notification.alert(
                                  'Dina inställningar är sparade', // message
                                  null, // callback
                                  'Inställningar', // title
                                  'OK' // buttonName
                                );
                                 
                              },
                              error: function(){
                                 
                                  navigator.notification.alert(
                                  'Det gick ej att spara dina inställningar', // message
                                  null, // callback
                                  'Inställningar', // title
                                  'OK' // buttonName
                                );
                              }
                          });
                        
                          db.setItem("push_boolean", push_boolean);
                          db.setItem("settings", JSON.stringify(settings_array));
                        }

                    });
  

                    $('#settings #slider').bind("change",function()
                        {
                        if($(this).val() == "on")
                        {
                        $("#toggle_push").show();
                        }
                        else
                        {
                        $("#toggle_push").hide();
                        }
                        $('#settings').trigger("create");
                        });
                    
                    
                  });



$(document).on('pageinit', "#about", function()
               {

                  refreshAbout();


              $('#refresh_about').mouseup(function()
                {
                  refreshAbout();
                });
               
               
               });

function refreshAbout()
{

               $.ajax({
                      type: "GET",
                      url: "http://skill.se/millnet/about.xml",
                      dataType: "xml",
                      success: readAboutXml,
                      error: errorMessage
                      });
               
               
               function readAboutXml(about_xml)
               {
                $('#refresh_about').hide();
                  about_xml_boolean = about_xml;
                 var about_content_staff = $('div#about_content ul div#about_staff');
                 var about_text = $(about_xml).find('about about_content').text();
                 $('div#about_content ul div#about_text').html(about_text);                      
                 var index = 0;
                 
                 about_content_staff.append("<table>");

                 $(about_xml).find("staff recruiter").each(function()
                                                           {
                                                           if(index%2 == 0)
                                                           {
                                                              about_content_staff.find("table").append('<tr>');
                                                           }
                                                           var recruiter_img = $(this).find('image').text();
                                                           var recruiter_name = $(this).find('name').text();
                                                           var recruiter_phone = $(this).find('phone').text();
                                                           var recruiter_mobile = $(this).find('mobile').text();
                                                           var recruiter_mail = $(this).find('mail').text();
                                                           var recruiter_info = $(this).find('info').text();

                                                           about_content_staff.find("tr:last").append("<td>");
                                                           about_content_staff.find("td:last").append("<img src='"+recruiter_img+"'><h3>"+recruiter_name+'</h3><p>'+recruiter_info+'</p><p><a href="tel:'+recruiter_phone+'">'+recruiter_phone+'</a></p>'+'<p><a href="tel:'+recruiter_mobile+'">'+recruiter_mobile+'</a></p>'+'<p><a href="mailto:'+recruiter_mail+'">'+recruiter_mail+'</a></p>');
                                                           
                                                           about_content_staff.find("td:last").append();
                                                          
                                                           about_content_staff.find("tr:last").append("</td>");

                                                           index++;
                                                           });

                  $("div#about_content").iscrollview("refresh");
        }
               
}

function showJobFromNotification(button_nr)
{
  if(button_nr == 1)
  {
      $.mobile.changePage("#detailed_job_view",{ transition: "none"});
  }
}

$(document).on('pageinit', "#tips", function()
{             
                  refreshTips();
              $('#refresh_tips').mouseup(function()
                {
                  refreshTips();
                });


});

function refreshTips()
{
  $.ajax({
      type: "GET",
      url: "http://skill.se/millnet/tips.xml",
      dataType: "xml",
      success: readTipsXml,
      error: errorMessage
      });

      function readTipsXml(tips_xml)
      {
        $('#refresh_tips').hide();
                tips_xml_boolean = tips_xml;
                var tips_text = $(tips_xml).find('tips tips_content').text();
                $('#tips_content ul #tips_text').html(tips_text);
                
                $("div#tips_content").trigger("create");
      $("div#tips_content").iscrollview("refresh");
      }
      
}

$(document).on('pageinit', "#first_time_view", function()
               {
               var placement_div = $('#first_time_placement');
               var area_div = $('#first_time_area');
               var assignment_type_div = $('#first_time_assignment_type');
               var welcome_div = $('#first_time_welcome');


               
               placement_div.hide();
               area_div.hide();
               assignment_type_div.hide();
               
               $('#first_time_view').trigger('create');
               
               $('#welcome_continue').click(function(event)
                                                {
                                                
                                                if($("#welcome_slider").val()=="off")
                                                {
                                                push_boolean = false;
                                                db.setItem("push_boolean", push_boolean);
                                                $('#settings #slider').val('off');
                                                $('#settings #slider').slider('refresh');
                                                $('#toggle_push').hide();
                                                $.mobile.changePage("#jobs",{ transition: "none"});
                                                }
                                                else
                                                {
                                                push_boolean = true;
                                                welcome_div.hide();
                                                placement_div.show();
                                                }

                                                });
               
                $('#placement_continue').click(function(event)
                {
                                            placement_div.hide();
                                            area_div.show();
                });

                $('#area_continue').click(function(event)
                {
                                              area_div.hide();
                                              assignment_type_div.show();
                });

                $('#assignment_type_continue').click(function(event)
                {
                                                         settings_array = $('input:checkbox:checked.checkbox_group').map(function ()
                                                                                                                         {
                                                                                                                         return this.value;
                                                                                                                         }).get();
                                                         if(device_token.length>0)
                                                         {
                                                         $.ajax({
                                                                type: 'POST',
                                                                data: {"device_token":device_token,"prenum_array":settings_array} ,
                                                                url: 'http://pervelander.se/examensarbete/post_prenum_android.php',
                                                                success: function(data){
                                                                console.log(data);
                                                                navigator.notification.alert(
                                                                                             'Dina inställningar sparades',
                                                                                             null,
                                                                                             'Inställningar',
                                                                                             'OK'
                                                                                             );
                                                                },
                                                                error: function(){
                                                                console.log(data);
                                                                navigator.notification.alert(
                                                                                             'Det gick ej att spara dina inställningar',
                                                                                             null,
                                                                                             'Inställningar',
                                                                                             'OK'
                                                                                             );
                                                                }
                                                                });
                                                         db.setItem("settings",JSON.stringify(settings_array));
                                                         db.setItem("push_boolean",push_boolean);
                                                         
                                                         
                                                         $.each(settings_array, function(index,value)
                                                          {
                                                          $('input[name="'+value+'"]').prop("checked",true);
                                                          });
                                                          $('#settings_content').trigger("create");

                                                         }
                                                         $.mobile.changePage("#jobs",{ transition: "none"});

                });

                $('#placement_back').click(function(event)
                                {
                                        placement_div.hide();
                                        welcome_div.show();
                                });

                $('#area_back').click(function(event)
                                {
                                        area_div.hide();
                                        placement_div.show();
                                });

                 $('#assignment_back').click(function(event)
                                {
                                        assignment_type_div.hide();
                                        area_div.show();
                                });
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
              device_token=e.regid;
            }
            break;
            
        case 'message':


        //alert(e.message);

        job_id = e.payload.job_id;
        navigator.notification.confirm(
        e.payload.message, // message
        showJobFromNotification, // callback
        'Ett jobb som passar dig!', // title
        'Visa, Stäng' // buttonName
        );
            // this is the actual push notification. its format depends on the data model
            // of the intermediary push server which must also be reflected in GCMIntentService.java
            
            break;
            
        case 'error':
            alert('GCM error = '+e.msg);
            break;
            
        default:
            alert('An unknown GCM event has occurred');
            break;
    }
}};
