global with sharing class oppoCloseDate {
    @AuraEnabled
    global static string getOppo()
    {
        list<opportunity> oppoList = new list<opportunity>();
        oppoList = [ SELECT Id, Name, closeDate FROM opportunity];
        return JSON.serialize(oppoList); 
    }
}