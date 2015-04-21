//alert(document.cookie);
$.cookie.json = true;

if($.cookie("portfolio") == null){
    //creating a new section with the defaul values
    var json = {"portfolio":{
        "money":100000, 
         "stock":[
        {
            "company": "Ford",
            "quantity": 20,
            "paid":14.99,
            "symbol": "F"
        },
        {
            "company": "General Electric",
            "quantity": 10,
            "paid":20,
            "symbol": "GE"
        },
        {
            "company": "Microsoft",
            "quantity": 30,
            "paid":24.99,
            "symbol": "MSFT"
        }
    ]}};
    $.cookie('portfolio', JSON.stringify(json), { expires: 2 });
    
}

var _portfolio = JSON.parse($.cookie('portfolio'));


updateTable();

console.log(_portfolio);

//adding the element into the cookie
function addItemBackUp(companyName, quantity, valuePaid, symbol){
    
    var obj = checkExsits(symbol);
    
    if(obj != null){
        obj.quantity = parseInt(obj.quantity) + parseInt(quantity);
        obj.paid = formatMoney(parseFloat(valuePaid) + parseFloat(obj.paid));
    }else{
        //adding a new element
        
        //adding into the beggining of the table, creates 
        //the impression of more recent
        _portfolio.portfolio.stock.unshift({
             "company": companyName,
            "quantity": quantity,
            "paid": valuePaid,
            "symbol": symbol
        });
    }
    
    $.removeCookie('portfolio');
    $.cookie('portfolio', JSON.stringify(_portfolio), { expires: 2 });
    
}

function debitMoney(value){
    
    _portfolio.portfolio.money -= value;
    $.removeCookie('portfolio');
    $.cookie('portfolio', JSON.stringify(_portfolio), { expires: 2 });
}

function addingMoney(value){
    
    _portfolio.portfolio.money += value;
    
    $.removeCookie('portfolio');
    $.cookie('portfolio', JSON.stringify(_portfolio), { expires: 2 });
}

function debitStock(quantity, stock){
    if(stock.quantity - quantity > 0){
        //just update the value
        stock.quantity = parseInt(stock.quantity) - quantity;
    }else{
        //removing the element from the array
        var array = [];
        for(var i = 0; i < _portfolio.portfolio.stock.length; i++){
            if(_portfolio.portfolio.stock[i].symbol != stock.symbol){
                array.push(_portfolio.portfolio.stock[i]);
            }
        }
        _portfolio.portfolio.stock = array;
    }
    
    $.removeCookie('portfolio');
    $.cookie('portfolio', JSON.stringify(_portfolio), { expires: 2 });
    
}

//checking if the element exists into the cookie "database"
function checkExsits(symbol){
    
    var i = 0; 
    var exists = false;
    console.log(i);
    while(i < _portfolio.portfolio.stock.length && !exists){
        console.log(i);
        if(_portfolio.portfolio.stock[i].symbol != symbol){
            i++;
        }else{
            exists = true;
        } 
    }
    
    if(!exists){
//        alert("não existe");
        return null;
    }
    
    return _portfolio.portfolio.stock[i];
}