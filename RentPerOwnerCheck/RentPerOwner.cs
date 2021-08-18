using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;
using Microsoft.Xrm.Sdk.Query;

namespace MyPlugins
{
    public class RentPerOwner : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // Extract the tracing service for use in debugging sandboxed plug-ins.  
            // If you are not registering the plug-in in the sandbox, then you do  
            // not have to add any tracing service related code.  
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Obtain the execution context from the service provider.  
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));

            // Obtain the organization service reference which you will need for  
            // web service calls.  
            IOrganizationServiceFactory serviceFactory =
                (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);



            // The InputParameters collection contains all the data passed in the message request.  
            if (context.InputParameters.Contains("Target") &&
                context.InputParameters["Target"] is Entity)
            {
                // Obtain the target entity from the input parameters.  
                Entity rent = (Entity)context.InputParameters["Target"];


                try
                {
                    // Plug-in business logic goes here.  

                    if (context.MessageName == "Create")

                    {
                        if (rent.Attributes.Contains("statuscode"))
                        {
                            //check first if current rent status is renting
                            var statusReason = ((OptionSetValue)rent.Attributes["statuscode"]).Value;
                            if (statusReason == 735370001)
                            {

                                if (rent.Attributes.Contains("crc6f_customer"))
                                {
                                    var customerId = ((EntityReference)rent.Attributes["crc6f_customer"]).Id;


                                    QueryExpression query = new QueryExpression("crc6f_rent");
                                    query.ColumnSet = new ColumnSet(new string[] { "crc6f_customer" });

                                    // get all rents with same customer in status renting
                                    FilterExpression rentFilter = new FilterExpression(LogicalOperator.And);
                                    rentFilter.AddCondition("crc6f_customer", ConditionOperator.Equal, customerId);
                                    rentFilter.AddCondition("statuscode", ConditionOperator.Equal, 735370001);
                                    query.Criteria = rentFilter;

                                    EntityCollection collection = service.RetrieveMultiple(query);


                                    if (collection.Entities.Count >= 10)
                                    {
                                        throw new InvalidPluginExecutionException("Can't create more then 10 rents in status renting per cutomer");
                                    }
                                }
                            }
                        }
                    }

                    if (context.MessageName == "Update")

                    {
                        Entity preRentImage = (Entity)context.PreEntityImages["RentImage"];

                        //get status reason field
                        int statusReason;
                        if (rent.Attributes.Contains("statuscode"))
                        {
                            statusReason = ((OptionSetValue)rent.Attributes["statuscode"]).Value;
                        }
                        else
                        {
                            statusReason = ((OptionSetValue)preRentImage.Attributes["statuscode"]).Value;
                        }

                        if (statusReason == 735370001)
                        {
                            //get customer
                            Guid customerId;
                            if (rent.Attributes.Contains("crc6f_customer"))
                            {
                                customerId = ((EntityReference)rent.Attributes["crc6f_customer"]).Id;
                            }
                            else
                            {
                                customerId = ((EntityReference)preRentImage.Attributes["crc6f_customer"]).Id;
                            }

                            QueryExpression query = new QueryExpression("crc6f_rent");
                            query.ColumnSet = new ColumnSet(new string[] { "crc6f_customer" });

                            // get all rents with same customer in status renting
                            FilterExpression rentFilter = new FilterExpression(LogicalOperator.And);
                            rentFilter.AddCondition("crc6f_customer", ConditionOperator.Equal, customerId);
                            rentFilter.AddCondition("statuscode", ConditionOperator.Equal, 735370001);
                            query.Criteria = rentFilter;

                            EntityCollection collection = service.RetrieveMultiple(query);


                            if (collection.Entities.Count >= 10)
                            {
                                throw new InvalidPluginExecutionException("Can't create more then 10 rents in status renting per cutomer");
                            }
                        }



                    }

                }

                catch (FaultException<OrganizationServiceFault> ex)
                {
                    throw new InvalidPluginExecutionException("An error occurred in MyPlug-in.", ex);
                }

                catch (Exception ex)
                {
                    tracingService.Trace("MyPlugin: {0}", ex.ToString());
                    throw;
                }
            }
        }
    }
}