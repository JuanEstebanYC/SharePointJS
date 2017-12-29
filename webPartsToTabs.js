/**
 * @fileOverview 
 * This helper create tabs for each webpart into the page
 *
 * @requires jQuery 3.1.1 
 * @requires Bootstrap 3.3
 * 
 * @version 1.0
 */

var webPartsToTabs = (function()
{
    //Variables
    var webparts,
        tabsContainer;


    // Funciones públicas
    var load = function()
    {   
        initComponents();

        var interval = setInterval(function()
        { 
           var isReadyTheContent = (webparts.length > 0) ? true : false;
           if(!isReadyTheContent)
           {
                initComponents();
           }
           else{
                clearInterval(interval);
                insertHtml();
            }
        }, 1000);    
    };

    //Funciones privadas
    var initComponents = function()
    {
        var idContainer = 'tab-content';
        webparts = document.querySelectorAll('[id^=MSOZoneCell_WebPart]');
        tabsContainer = document.getElementById(idContainer);
    };

    var insertHtml = function()
    {
        var tabs = "",
            idHeader = 'tablist',
            tabHeaderHtml = '<li role="presentation" class="{2}"><a href="#{1}" aria-controls="{1}" role="tab" data-toggle="tab">{0}</a></li>',
            isFirstTab = true,
            activeClass = 'active',
            emptyClass = '';
            
        for(var i = 0; i < webparts.length; i++){
            
            if(webparts[i].querySelectorAll('nobr span')[0] != undefined && webparts[i].querySelectorAll('nobr span')[0].innerText != undefined)
            {
                var webPartTitle = webparts[i].querySelectorAll('nobr span')[0].innerText,
                    webPartContent = webparts[i].querySelectorAll('table')[0],
                    classActive = (isFirstTab) ?  activeClass : emptyClass,
                    nameTab = webPartTitle.toLowerCase().replace(new RegExp(' ', 'g'), '-');
        
                tabs += String.format(tabHeaderHtml,webPartTitle,nameTab,classActive);
        
                var newTabContent = createTabContent(nameTab,classActive);
                newTabContent.appendChild(webPartContent);
                tabsContainer.appendChild(newTabContent);
        
                isFirstTab = false;
            }
        }

        document.getElementById(idHeader).innerHTML = tabs;
        document.getElementById("to-delete-content").remove(); 
    };

    var createTabContent = function(webPartTitle,classActive)
    {   
        var attributes = 
        {
            "class" : String.format("tab-pane {0}",classActive),
            "id" : webPartTitle.toLowerCase(),
            "role" : "tabpanel",
        };
    
        return createElementWithAttributes("div",attributes);
    };
    
    var createElementWithAttributes = function(_element, _attributeValues)
    {
        var element = document.createElement(_element);
        for (var item in _attributeValues){
            var att = document.createAttribute(item);
            att.value = _attributeValues[item];
            element.setAttributeNode(att);
        }
        return element;
    };

    return {
        load : load
    };

})();

$(document).ready(function(){
	//Valida que no este en modo edición antes de iniciar el proceso
	if(document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value != "1")
	{
		webPartsToTabs.load();
	}
});