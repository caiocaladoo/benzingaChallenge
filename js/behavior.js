var _bidValue = 0,
    _askValue = 0;

var query = location.search.slice(3, location.search.length);

//do a "search" using the stock's symbol
$(document).on("click", ".item-table", function(){
    window.location = "/benzinga/?q="+$(this).attr('id');
});


//updating the chart's animation
function updateChart(bid, ask){
    _askValue = ask;
    _bidValue = bid;
    
    var askHeight = 0,
        askY = 0,
        bidHeight = 0,
        bidY = 0;
    
    if(bid > ask){
        bidHeight = 140;
        askHeight = ask/bid;
        askHeight = 140 * askHeight;
        
        bidY = 30;
        askY = 170 - askHeight;
    }else{
        askHeight = 140;
        bidHeight = bid/(ask + 14); //10% of 140
        bidHeight = 140 * bidHeight;
        
        askY = 30;
        bidY = 170 - (bidHeight);
        
    }
    
    //<>Height --> bar's height
    //<>Y --> bar's position into the SVG
    //<> --> value that is going to be displayed
    updateHeight(bidHeight, bidY, bid, askHeight, askY, ask);
    //updateHeight(bid, bidY, bidPrice, ask, askY, askPrice)

}

//updating the table everytime that the page is load
function updateTable(){
    
    //O dinheiro tem uma dependência com a tabela
    //atualizar aqui também o dinheiro
    $("#currentMoney").text(formatMoney(_portfolio.portfolio.money));
    
    for(var i = 0; i < _portfolio.portfolio.stock.length; i++){
        console.log(_portfolio.portfolio.stock[i].company);
        
        var btn = "<button class='btn-small btn-default item-table' id="+ _portfolio.portfolio.stock[i].symbol +">View Stock</button>";
        
        var tr = '<tr><td>'
            + _portfolio.portfolio.stock[i].company + '</td>'
            +'<td>' + _portfolio.portfolio.stock[i].quantity + '</td>'
            +'<td>' + _portfolio.portfolio.stock[i].paid + '</td>'
            +'<td>' + btn + '</td>'
            +'</tr>';
            
        $('#table > tbody').append(tr);
    }
}

//formating the text to the correct format
function formatMoney(n) {
    return  n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
//    return  "$ " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}


//SEARCH button
$('#qtdForm').bind('click keyup', function(){
    var texto = parseFloat($(this).val());
    
    if($("#buyBtn").hasClass("btn-active")){
        //"I'm buying something"

        texto = parseFloat($(this).val()) * _askValue;
    }else{

        texto = texto * _bidValue;
    }
    
    
    
    if(isNaN(texto) || texto == "0")
        texto = "";
    
    if(texto != "")
        texto = formatMoney(parseFloat(texto));
    
   $('#value').text(texto);
});


//BUTTONS actions
$("#buyBtn").click(function(){
    hideErrorsMessages();
    if($("#sellBtn").hasClass("btn-active")){
        $('#value').text("");
        $("#form").trigger('reset');    
        $("#sellBtn").removeClass("btn-active");
    }else if($("#buyBtn").hasClass("btn-active")){
        hideForm();
        $("#buyBtn").removeClass("btn-active");   
        return;
    }
    $("#buyBtn").addClass("btn-active");
    $("#form").css("display", "inline-block");
    $(".form-action").css("display", "inline-block");
    
});

$("#sellBtn").click(function(){
    hideErrorsMessages();
    if($("#buyBtn").hasClass("btn-active")){
        $('#value').text("");
        $("#form").trigger('reset');    
        $("#buyBtn").removeClass("btn-active");
    }else if($("#sellBtn").hasClass("btn-active")){
        hideForm();
        $("#sellBtn").removeClass("btn-active");   
        return;
    }
    $("#sellBtn").addClass("btn-active");
    $("#form").css("display", "inline-block");
    $(".form-action").css("display", "inline-block");
});

$("#confirmBtn").click(function(){

    if($("#qtdForm").val() > 0){
            if($("#buyBtn").hasClass("btn-active")){

            var value = parseFloat($("#value").text().split(",").join(""));
            if(_portfolio.portfolio.money - value >= 0){

                debitMoney(value);
                addItemBackUp($('#nameSymbol').text(), $("#qtdForm").val(), value, query);
                reloadPage();
            }else{
                //no funds show message
                $("#noMoneyMessage").show();
            }


        }else{
            //SELLING

            var quantity = $("#qtdForm").val();
            var stock = checkExsits(query);

            if(stock == null){
                $("#noStockMessage").show();
            }else if(stock.quantity - quantity >= 0){
                var value = parseFloat($("#value").text().split(",").join(""));
                addingMoney(value);
                debitStock(quantity, stock);
                reloadPage();

            }else{
                //don't have stock enough to sell all of them
                $("#noStockMessage").html("We feel sorry in say that, but you don't have stock enough to complete this action.<br><br>However, you still have " + stock.quantity +" stock(s) to sell.<br>" );
                $("#noStockMessage").show();
            }

        }
    }
    
});

$("#cancelBtn").click(function(){
    hideForm();
    $("#buyBtn").removeClass("btn-active");
    $("#sellBtn").removeClass("btn-active");
});

function hideForm(){
    $('#value').text("");
    $("#form").trigger('reset');
    $("#form").hide();
    $(".form-action").hide();
    hideErrorsMessages();
}

function hideErrorsMessages(){
    $("#noStockMessage").text("We feel sorry in say that, but you don't have stock enough to complete this action.");
    $("#noMoneyMessage").hide();
    $("#noStockMessage").hide();
}

//INITIAL settings / requests
if(location.search != ""){
    query = location.search.slice(3, location.search.length);
    var url = "http://careers-data.benzinga.com/rest/richquote?symbols=" + query;
    console.log(url);
    $.ajax({
        type: 'get',
        url: url,
        dataType: 'jsonp',
        context: this, 
        success: function(data){
            
            if(Object.getOwnPropertyNames(data).length > 0 && !data[query].hasOwnProperty('error')){
                //sucessfull return
                $("#nameSymbol").text(data[query].name);
                $("#symbolCode").text("(" + query + ")");
                $("#closeSymbol").text(data[query].close);
                if(data[query].change <=0){
                    $("#changeSymbol").html("<i class='fa fa-arrow-down fa-fw'></i>" + ((-1)*data[query].change));
                    $("#changeSymbol").addClass("red");
                }else{
                    $("#changeSymbol").html("<i class='fa fa-arrow-up fa-fw'></i>" + data[query].change);
                    $("#changeSymbol").addClass("blue");
                }
                
                if(data[query].changePercent <=0){
                    $("#changePercentageSymbol").text(data[query].changePercent + "%");
                    $("#changePercentageSymbol").addClass("red");
                }else{
                    $("#changePercentageSymbol").text(data[query].changePercent + "%");
                    $("#changePercentageSymbol").addClass("blue");
                }
                
                updateChart(data[query].bidPrice, data[query].askPrice);
                $("#greetingDiv").hide();
                $("#chartDiv").show();
                
            }else{
                //displaying the error to the user
                if(Object.getOwnPropertyNames(data).length > 0){
                    $("#errorDivMessage").text("Did you type " + query +"?");
                }else{
                    $("#errorDivMessage").text("Did you type something?");        
                }

                $("#greetingDiv").hide();
                $("#errorDiv").show();
            }
        },
        error: function (request, status, error) {
            $("#errorDivMessage").text("Did you type " + query +"?");
            $("#greetingDiv").hide();
            $("#errorDiv").show();
    },
        cache: false
    });
}

window.onload = function(){
    $("#form").trigger('reset');
};

function reloadPage(){
    window.location = "/benzinga/?q=" + query;
}
