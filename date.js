module.exports.getDate=function()
{
    const day=new Date();
    options={
        weekday:"long",
        day:"numeric",
        month:"long"
    }
    return day.toLocaleDateString("en-US",options);
};

module.exports.getDay=getDay;
function getDay()
{
    const day=new Date();
    options={
        weekday:"long",
    }
    return day.toLocaleDateString("en-US",options);
};