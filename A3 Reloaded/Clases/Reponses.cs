using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Clases
{
    public class Reponses
    {
        public string getResponse_table(string table,string column, string identifier, string id)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            string result = "";
            try
            {
                System.Data.SqlClient.SqlDataReader reader;
                System.Data.SqlClient.SqlCommand sql;
                con.Open();
                sql = new System.Data.SqlClient.SqlCommand();
                sql.CommandText = "select " + column + " from " + table + " where " + identifier + "=" + id;
                sql.Connection = con;
                using (reader = sql.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        result = reader[0].ToString();
                    }
                    else
                    {
                        result = "Error en ExecuteReader. Revisar la función en la base de datos.";
                    }
                }
                con.Close();
            }
            catch (Exception e)
            {
                ErrorLogger.Registrar(this, e.ToString(), result);
            }
            return result;
        }
        public string getResponse_function(string function,string identifier, string id)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            string result = "";
            try
            {
                if (identifier == "1") {
                   function = function + '(' + id + ')';
                }
                System.Data.SqlClient.SqlDataReader reader;
                System.Data.SqlClient.SqlCommand sql;
                con.Open();
                sql = new System.Data.SqlClient.SqlCommand();
                sql.CommandText = "select " + function ;
                sql.Connection = con;
                using (reader = sql.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        result = reader[0].ToString();
                    }
                    else
                    {
                        result = "Error en ExecuteReader. Revisar la función en la base de datos.";
                    }
                }
                con.Close();
            }
            catch (Exception e)
            {
                ErrorLogger.Registrar(this, e.ToString(), result);
            }
            return result;
        }
    }
}