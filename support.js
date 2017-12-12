/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var simac = simac || {};
simac.modules = simac.modules ||{};
simac.modules.suport = simac.modules.support || {};
simac.modules.support = (function ($){

var showed = new Array;  

return {
    addMessage : function(){
        console.log ("addmessage");
        if (($("#newpopis").val()=== "") || ($("#inputname").val()=== "")){
               alert ("Pole noveho prispevku nebo jmeno prispevovatele nesmi byt prazdne"); 
               
        } else {
            var document = { 
                "popis" : $("#newpopis").val(),
                "vlakno"  : $("#list_vlakno :radio:checked").attr('id'),
                "kdo" : $("#inputname").val()
            }; 
        
            $.ajax({
                type: 'POST',	
                url: 'http://kc3-bck.centrum.cpost.cz/support/setnotesjson.php',	
                headers: {	
                    "Content-Type": "application/json"
                },
                dataType: 'json',	
                data: JSON.stringify(document),	
                success: function(xhr){
                    console.log ("xmlPut(): success ");
                    simac.modules.support.getMessage($("#list_vlakno :radio:checked").attr('id'));             
                },
                error: function (xhr,textStatus,error){	
                    console.log ("xmlPut(): error " + xhr.responseText);
                    console.log ("xmlPut(): error " + textStatus);
                    console.log ("xmlPut(): error " + error);
           
                }
            });    
        }  
    },
        
        
    
    
    getMessage : function(vlaknoid){
        console.log ("getMessage pro vlakno: " + vlaknoid);
        var document = { 
            "notes"  : vlaknoid
        }; 
        
        $.ajax({
          type: 'POST',	
	  url: 'http://kc3-bck.centrum.cpost.cz/support/getnotesjson.php',	
	 headers: {	
	    "Content-Type": "application/json"
            },
         dataType: 'json',	
	 data: JSON.stringify(document),	
	 success: function(xhr){
            console.log ("getMessage(): success ");
            //var vlakna = $.parseJSON(xhr.content);
            $("#list_messages").empty();
            //$("#list_messages").append("<input id='newpopis' height='50' type='text' name='Novy komentar' size='150' required>");
            if ($("#list_vlakno :checked").hasClass("dokonceno")) {
                
            } else {
                $("#list_messages").append("<textarea id='newpopis' class='message' rows='10', cols='100' required wrap='hard' maxlength='1024'></textarea>");
                $("#list_messages").append("<button onclick='simac.modules.support.addMessage();'>pridat Popis</button>");
            }
            $.each(xhr, function (index,surdata) {
              var my_notes = "<p>" + surdata.kdo + " - " + surdata.kdy + "</p>"; 
              my_notes += "<textarea id='popis' class='message' readonly maxlength='1024' rows=\"5\" cols=\"100\">" + surdata.popis + "</textarea>";
              $("#list_messages").append(my_notes).append("<BR>");
              
            });   
            
         },
         error: function (xhr,textStatus,error){	
	   console.log ("getMessage(): error " + xhr.responseText);
           console.log ("getMessage(): error " + textStatus);
           console.log ("getMessage(): error " + error);
           
         }
    });
    },
        
    addVlakno : function(){
        console.log ("addvlakno");
        
        if (($("#newvlakno").val()=== "") || ($("#newvlakno").val().length > 80) || ($("#select_topic").val() === 'Vyber technickou oblast') || ($("#select_topic").val()==='Zobraz vse')){
               alert ("Chyba v zadani jmena vlakna nebo vyberu oblasti "); 
         
         
            
            
        } else {
                
            var document = { 
                "topic" : $("#newvlakno").val(),
                    "vlakno"  : $("#select_topic").val()
            }; 
            var document2 = { 
                "popis" : $("#inputname").val() + ": " + 'Zrizuje Nove Vlakno',
                "vlakno"  : $("#newvlakno").val(),
                "kdo" : $("#inputname").val()
            }; 
            $.ajax({
                type: 'POST',	
                url: 'http://kc3-bck.centrum.cpost.cz/support/setvlaknojson.php',	
                headers: {	
                    "Content-Type": "application/json"
                },
                dataType: 'json',	
                data: JSON.stringify(document),	
                success: function(xhr){
                    console.log ("xmlPut(): success ");
                    $("#newvlakno").val("");
                    //simac.modules.support.getVlakno();
                    $.ajax({
                        type: 'POST',	
                        url: 'http://kc3-bck.centrum.cpost.cz/support/setnotesjsoninit.php',	
                        headers: {	
                            "Content-Type": "application/json"
                        },
                        dataType: 'json',	
                        data: JSON.stringify(document2),	
                        success: function(xhr){
                            console.log ("xmlPut(): success ");
                            simac.modules.support.getVlakno();
                        },
                        error: function (xhr,textStatus,error){	
                            console.log ("xmlPut(): error " + xhr.responseText);
                            console.log ("xmlPut(): error " + textStatus);
                            console.log ("xmlPut(): error " + error);
                        } 
                                  
                    });
                },
                error: function (xhr,textStatus,error){	
                    console.log ("xmlPut(): error " + xhr.responseText);
                    console.log ("xmlPut(): error " + textStatus);
                    console.log ("xmlPut(): error " + error);
                }
            });    
             
           
             
           
        }    
    },
        
        
    
    
    getVlakno : function(){
        console.log ("getVlakno");
        var document = { 
            "topic"  : $("#select_topic").val()
        }; 
        var semafor =0;
        
        $.ajax({
          type: 'POST',	
	  url: 'http://kc3-bck.centrum.cpost.cz/support/getvlaknojson.php',	
	 headers: {	
	    "Content-Type": "application/json"
            },
         dataType: 'json',	
	 data: JSON.stringify(document),	
	 success: function(xhr){
            console.log ("xmlPut(): success ");
            //var vlakna = $.parseJSON(xhr.content);
            $("#list_vlakno").empty();
           
                     
            
            $.each(xhr, function (index,surdata) {
                //nejprve vypíše neukonèená vlákna
                if (surdata.result === 'f') {
                    if ( showed[surdata.vlaknoid]) {
                        
                        if ( parseInt(showed[surdata.vlaknoid]) < parseInt(surdata.popisid)){
                            $(".vlaknoid" + surdata.vlaknoid + " BR").remove();
                            $(".vlaknoid" + surdata.vlaknoid).remove();
                            semafor = 0;
                            console.log("odstranuji stare vlaknoid: " + surdata.vlaknoid + " novejsi popisid: " + surdata.popisid);
                            
                        } else {
                            semafor = 1;
                        }
                        
                    } 
                    console.log("semafor : " + semafor);
                    if (semafor === 0) {
                        console.log("Pridavam tlacitko " + surdata.vlaknoid);
                        var my_radio = $('<input />', { 
                            type: 'radio', 
                            name: 'vybervlakno', 
                            id: surdata.vlaknoid,
                            class: 'vlaknoid' + surdata.vlaknoid,
                            value: surdata.vlaknoname
                        });
                        $("#list_vlakno").append(my_radio)
                        .append("<label class=vlaknoid" + surdata.vlaknoid + ">" + surdata.vlaknoid + ": " + surdata.kdo + ": " + surdata.kdy + " </BR> " + "     " + surdata.vlaknoname + "</BR></label>");
                        $(".vlaknoid" + surdata.vlaknoid).addClass('nedokonceno');
                        showed[surdata.vlaknoid] = surdata.popisid;
                        
                    }
                    semafor = 0;
                }
            });
            
            showed = [];
            
            $.each(xhr, function (index,surdata) {
                if (surdata.result ==='t') {
                    var my_radio = $('<input />', { 
                        type: 'radio', 
                        name: 'vybervlakno', 
                        id: surdata.vlaknoid,
                        class: 'vlaknoid' + surdata.vlaknoid,
                        value: surdata.vlaknoname
                    });
                    $("#list_vlakno").append(my_radio)
                      .append("<label class=vlaknoid" + surdata.vlaknoid + ">" + surdata.vlaknoid + ": " + surdata.vlaknoname + "</label>")
                      .append("<BR>");
                    $(".vlaknoid" + surdata.vlaknoid).addClass('dokonceno');
                }     
            
               
                if ($("#finished").is(':checked')) {
                    $(".dokonceno").show();
                } else {
                    $(".dokonceno").hide();
                }
            });   
            
            
            $('#list_vlakno input[type=radio]').change(function(){
                $("#list_messages").empty();
                simac.modules.support.getMessage($(this).attr('id'));
              });  
            
         },
         error: function (xhr,textStatus,error){	
	   console.log ("xmlPut(): error " + xhr.responseText);
           console.log ("xmlPut(): error " + textStatus);
           console.log ("xmlPut(): error " + error);
           
         }
    });
    },
    
    init : function(){
        $("#select_topic").append("<option selected value='Topic'>Vyber technickou oblast</option>");
        $("#select_topic").append("<option value='ShowAll'>Zobraz vse</option>");
        $("#newvlakno").hide();
        $("#pridejvlakno").hide();
        $.get("gettopicjson.php", function (data){
            var surConfig = $.parseJSON(data);   
            $.each(surConfig, function (index,surdata) {
                $("#select_topic").append("<option value='" + surdata.topicname + "'>" + surdata.topicname + "</option>");
            });
        });
        $("#select_topic").change(function () {
            var selected = $(this).val();
            $("#list_messages").empty();
            
            switch (selected){
                case 'ShowAll' :
                    $("#newvlakno").hide();
                    $("#pridejvlakno").hide();
                    $("#list_vlakno").empty(); 
                    simac.modules.support.getVlakno();
                    break;
                case 'Topic' :  
                    $("#newvlakno").hide();
                    $("#pridejvlakno").hide();
                    $("#list_vlakno").empty(); 
                    break;
                default :
                    $("#newvlakno").show();
                    $("#pridejvlakno").show();
                    simac.modules.support.getVlakno();  
            }
            
            
            
            
        });
        $("#finished").change(function () {
             if ($("#finished").is(':checked')) {
                 $(".dokonceno").show();
             } else {
                 $(".dokonceno").hide();
             }
        });
       
  
        
    }

};

}(jQuery));


