using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Clases
{
    public class ProfileUser
    {
        public string mail { get; }
        public string name { get; }
        public string lastname { get; }
        public string manager { get; }
        public string managerCWID { get; set; }
        public byte[] photo { get; }
        public bool fotoBool { get; set; }
        public string cwid { get; set; }
        public string fullname { get; set; }
        public string employeeNo { get; set; }
        public string department { get; set; }
        public string company { get; set; }
        public string title { get; set; }

        public string get_fullName()
        {
            string fullname= name + " " + lastname + " (" + cwid + ")";
            return fullname;
        }

        public ProfileUser(string CWID)
        {
            SearchResultCollection results;
            DirectorySearcher ds = null;
            //DirectoryEntry de = new DirectoryEntry("LDAP://AD-BAYER-CNB");
            DirectoryEntry de = new DirectoryEntry("LDAP://BY12MV.bayer.cnb");

            // Build User Searcher
            ds = BuildUserSearcher(de);

            //ds.Filter = "(&(objectCategory=User)(objectClass=person)(name=" + CWID + "))";
            ds.Filter = "(&(sAMAccountName=" + CWID + ")(objectCategory=user))";


            results = ds.FindAll();

            foreach (SearchResult sr in results)
            {
                //CWIDuser 
                //if (sr.Properties["name"].Count > 0)
                //    Debug.WriteLine(sr.Properties["name"][0].ToString());
                this.cwid = CWID;
                // If not filled in, then you will get an error
                if (sr.Properties["mail"].Count > 0)
                    this.mail = sr.Properties["mail"][0].ToString();
                //Debug.WriteLine(sr.Properties["mail"][0].ToString());

                if (sr.Properties["givenname"].Count > 0)
                    this.name = sr.Properties["givenname"][0].ToString();
                //Debug.WriteLine(sr.Properties["givenname"][0].ToString());

                if (sr.Properties["sn"].Count > 0)
                    this.lastname = sr.Properties["sn"][0].ToString();
                if (sr.Properties["department"].Count > 0)
                    this.department = sr.Properties["department"][0].ToString();
                if (sr.Properties["title"].Count > 0)
                    this.title = sr.Properties["title"][0].ToString();
                if (sr.Properties["company"].Count > 0)
                    this.company = sr.Properties["company"][0].ToString();
                if (sr.Properties["manager"].Count > 0)
                {

                    this.manager = sr.Properties["manager"][0].ToString();
                    string manager = sr.Properties["manager"][0].ToString().Trim();
                    string[] propertiesManager = manager.Split(',');
                    string[] propertiesManagerCwid = propertiesManager[0].Split('=');
                    string ManagerCwid = propertiesManagerCwid[1];
                    this.managerCWID = ManagerCwid;
                }
                //Debug.WriteLine(sr.Properties["sn"][0].ToString());

                //if (sr.Properties["userPrincipalName"].Count > 0)
                //    Debug.WriteLine(sr.Properties["userPrincipalName"][0].ToString());

                //if (sr.Properties["distinguishedName"].Count > 0)
                //    Debug.WriteLine(sr.Properties["distinguishedName"][0].ToString());

                //var bytes = sr.Properties["thumbnailPhoto"][0] as byte[];
                this.fotoBool = false;
                if (sr.Properties["thumbnailPhoto"].Count > 0)
                {
                    this.fotoBool = true;
                    this.photo = sr.Properties["thumbnailPhoto"][0] as byte[];
                    //var bytes = sr.Properties["thumbnailPhoto"][0] as byte[];

                }
                this.fullname = sr.Properties["givenname"][0].ToString() + " " + sr.Properties["sn"][0].ToString();
            }
        }
        private DirectorySearcher BuildUserSearcher(DirectoryEntry de)
        {
            DirectorySearcher ds = null;

            ds = new DirectorySearcher(de);

            // Full Name
            ds.PropertiesToLoad.Add("name");

            // Email Address
            ds.PropertiesToLoad.Add("mail");

            // First Name
            ds.PropertiesToLoad.Add("givenname");

            // Last Name (Surname)
            ds.PropertiesToLoad.Add("sn");

            // Login Name
            ds.PropertiesToLoad.Add("userPrincipalName");

            // Distinguished Name
            ds.PropertiesToLoad.Add("distinguishedName");

            // User Foto
            ds.PropertiesToLoad.Add("thumbnailPhoto");
            //Manager
            ds.PropertiesToLoad.Add("manager");
            ds.PropertiesToLoad.Add("department");
            ds.PropertiesToLoad.Add("title");
            ds.PropertiesToLoad.Add("company");

            return ds;
        }
    }
}