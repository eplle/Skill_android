

document.addEventListener("deviceready", onDeviceReady, false);
var jobID;
var xml_all;
var detailed_div;


$(document).on('pageinit',"body",function()
           {
                detailed_div=$("div#detailed_job_content ul");
           
           
           });


function onDeviceReady() {

    //Get the xml from the web.
    
    //Remove the SplashScreen!!
     navigator.splashscreen.hide();


    }
$(document).on('pageinit', "#jobs", function()
                  {
                  $.ajax({
                         type: "GET",
                         url: "http://cv.skill.se/cv/rss.jsp?format=mtrxml&allads=1&fullad=1",
                         dataType: "xml",
                         success: parseXml,
                         timeout:4000,
                         });

                  
                  function parseXml(xml)
                  {
                  xml_all=xml;
                  //find every Tutorial and print the author
                  $(xml).find("job").each(function()
                                               {  
                                                    var link = $(this).find('applicationMethods link').attr('href');
                                                    var img = $(this).find('logo link').attr('href');
                                                    var title = $(this).find('title').text();
                                                    var id = $(this).attr('id');
                                                    
                                                    var date = $(this).find('pubDate').text();
                                                    var location = $(this).find('location').text();
                                                    var area = $(this).find('area').text();
                                                    var assignment_type = $(this).find('assignmentType').text();
                                                     $('div#jobs_content ul#job').append('<li class="listelement" data-id= "' + id + '" ><a><img src="' + img +'" class="ui-li-thumb"><p class="ui-li-heading">' + title + '</p><p class="ui-li-desc">'+area+','+assignment_type+'<br></br>' +location+', '+date+'</p></a></li>');



                                                   // $('div#jobs_content ul#job').append('<li class="listelement" data-id= "' + id + '" ><a><img src="' + img +'"class="ui-li-thumb"><p class="ui-li-heading">' + title + '</p></a></li>');
                        
                                                });
                  $('div#jobs_content ul#job').listview("refresh");
                  
                  $('li.listelement').click(function(){
                                          detailed_div.text("");
                                          jobID = $(this).data('id');

                                          $.mobile.changePage("#detailed_job_view",{ transition: "none"});
                                           //$.mobile.changePage("#detailed_job_view", true, true);
                                           
                                           
                                });
                  
                  
                  
      }
                  

                  
});

$(document).on('pageshow', '#detailed_job_view', function()
{
  var job = $(xml_all).find("job[id="+jobID+"]");
  var title = job.find('title').text();
  var description = job.find('description').text();
  var link = job.find('applicationMethods link').attr('href');
  var company = job.find('company name').text();
  $('#detailed_job_view div.header h1').text(company);
  //$('#detailed_job_view div.header').append("<h1>"+company+"</h1>");
  detailed_div.append("<h3>"+title+"</h3>");
  detailed_div.append("<p>"+description+"</p>");
  detailed_div.append('<button id="job_link">Ansök</button>');

  $('button#job_link').live("click", function()
    {
        ref = window.open(link,'_blank', 'location=no');
    });

    $("div#detailed_job_content").iscrollview("refresh");                       
                           
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
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }


};
