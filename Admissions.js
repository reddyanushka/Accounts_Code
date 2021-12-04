angular.module('library').controller('Cashier',function($scope,$http,$filter, $localStorage,$window,$route,$rootScope,apiurl){

 
    if(!$window.localStorage.getItem('logindata')){
           window.location.href = 'login.html';
       }
        $scope.userdata = JSON.parse($window.localStorage.getItem('logindata'));
       
       console.log($scope.userdata);
       console.log('hiii')
        $scope.logountnow =  function(){
            window.localStorage.removeItem('logindata');
           window.location.href = 'login.html';
    
            }
           
            
           var apiurl = apiurl.getUrl();
           $http.get(apiurl+"users/cashierlist").success(function(data){
               console.log(apiurl+"users/cashierlist");
               $scope.cashierdata = data;
           });
           //// date picker code
           $scope.fromDate,$scope.fromDate;
           $(function() {
               $('input[name="daterange"]').daterangepicker({
                 opens: 'left'
               }, function(start, end, label) {
                   console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                   $scope.fromDate=start.format('YYYY-MM-DD')
                   $scope.toDate=end.format('YYYY-MM-DD')
                   console.log($scope.fromDate)
             });
             });
             /// selecting School/clg
           $scope.selectUser=function(cashier)
           {
               //$scope.seldate=$scope.fromDate+' - '+$scope.toDate
               //console.log('--->  '+$scope.seldate)
               $scope.loading=true;
               console.log('from dates  :  '+$scope.fromDate)
               if($scope.fromDate==undefined ||cashier==undefined)
               {
                   $scope.cash=0,$scope.check=0,$scope.dd=0,$scope.online=0,$scope.swipe=0;
                   $scope.total=0;
                   $scope.amountDets=false;
                   $scope.nodata=false;
                   $scope.loading=false;
               }
               else
               {
                   $http.get(apiurl+"dcr/cashierDcr/"+cashier+'/'+$scope.fromDate+'/'+$scope.toDate).success(function(data){
                       console.log(apiurl+"dcr/cashierDcr/"+cashier+'/'+$scope.fromDate+'/'+$scope.toDate)
                       if(data.length!=0)
                       {
                           //console.log(data)
                           var paid=getUniqeElements(data,'cancelled');
                           //console.log('--->')
                           //console.log(paid)
                           //console.log('--->')
                           var paidData=[]
                           for(var i=0;i<paid.length;i++){
                               paidData[i]=data.filter(e=>e.cancelled==paid[i])
                           }
                           console.log(paidData)


                           $scope.cashTotal=getSumElements(data,'amt')
                           $scope.gstTotal=getSumElements(data,'gst_paid')
                           $scope.fineTotal=getSumElements(data,'fine')
                           console.log($scope.cashTotal)

                           $scope.cashTotalcancelled=getSumElements(paidData[1],'amt')
                           $scope.gstTotalcancelled=getSumElements(paidData[1],'gst_paid')
                           $scope.fineTotalcancelled=getSumElements(paidData[1],'fine')
                           console.log($scope.cashTotalcancelled)


                           $scope.amountDets=false;
                           $scope.section=false;
                           $scope.nodata=true;
                           $scope.loading=false;

                           $scope.CashierModeData=paidData;

                           var pay_mode=getUniqeElements(data,'payment_type');
                           console.log(pay_mode.length)
                           var modedata=[]
                           for(var i=0;i<pay_mode.length;i++){
                               modedata[i]=data.filter(e=>e.payment_type==pay_mode[i])
                           }
                           console.log(modedata)
                           $scope.cash=0,$scope.check=0,$scope.dd=0,$scope.online=0,$scope.swipe=0;
                           $scope.total=0;

                           for(var i=0;i<modedata.length;i++)
                           {
                               if(modedata[i][0].payment_type==1)
                               {
                                   console.log('cash')
                                   $scope.cash=getSumElements(modedata[i],'amt')+getSumElements(modedata[i],'gst_paid')+getSumElements(modedata[i],'fine');
                               }
                               if(modedata[i][0].payment_type==2)
                               {
                                   $scope.check=getSumElements(modedata[i],'amt')+getSumElements(modedata[i],'gst_paid')+getSumElements(modedata[i],'fine');
                               }
                               if(modedata[i][0].payment_type==3)
                               {
                                   $scope.dd=getSumElements(modedata[i],'amt')+getSumElements(modedata[i],'gst_paid')+getSumElements(modedata[i],'fine');
                               }
                               if(modedata[i][0].payment_type==4)
                               {
                                   $scope.online=getSumElements(modedata[i],'amt')+getSumElements(modedata[i],'gst_paid')+getSumElements(modedata[i],'fine');
                               }
                               if(modedata[i][0].payment_type==5)
                               {
                                   $scope.swipe=getSumElements(modedata[i],'amt')+getSumElements(modedata[i],'gst_paid')+getSumElements(modedata[i],'fine');
                               }
                           }
                           $scope.total=$scope.cash+$scope.check+$scope.dd+$scope.online+$scope.swipe;						}
                       else{
                           $scope.cash=0,$scope.check=0,$scope.dd=0,$scope.online=0,$scope.swipe=0;
                           $scope.total=0;
                           $scope.nodata=false;
                           $scope.loading=false;
                           $scope.section=true;
                           $scope.amountDets=true;

                       }

                   });
               }
               
           }
           $scope.downloadPdf = function() {
               console.log("button clicked");
               var doc = new jsPDF('p', 'pt', 'a4');
               doc.internal.scaleFactor = 2.25;
               var elementHandler = {
                   '#ignorePDF': function (element, renderer) {
                     return true;
                   }
                 };
                 var x=document.getElementById('report');
                 //x.style.backgroundColor="#FFFFFF";
                 var options = {
                   pagesplit: true,
                   margin: {
                       top: 15,
                       right: 20,
                       bottom: 0,
                       left: 20,
                       useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
                     }
              };
              doc.addHTML(x, 20, 10, options, function() {
                   doc.save('fee_report '+$scope.fromDate+' to '+$scope.toDate+'.pdf');
               });
           };
             //// excel code
             $scope.excel = function() {
               console.log("excel clicked");
               var data=new Blob([document.getElementById('report').innerHTML],{
                   type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
               })
               saveAs(data,'fee_report '+$scope.fromDate+' to '+$scope.toDate+'.xls')
             };


           function getUniqeElements(obj,field){
               var elements=[];
               for(var i in obj){
                   if(elements.indexOf(obj[i][field])==-1){
                       elements.push(obj[i][field]);
                   }
               }
               return elements;
           }

           function getSumElements(obj,field){
               //console.log(obj);
              var total=0;
              for(var i in obj)
                  total+=Number(obj[i][field]);
              return total;
            }
           //var apiurl = apiurl+"dcr/1";
           //console.log(apiurl)
});
