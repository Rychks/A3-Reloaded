using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Clases
{
	public class Home
	{
        public int obtener_TotalPag_BandejaA3_v2(string Fecha1, string Fecha2, string Linea, string Folio, string TipoA3,
           string CWID, string CWID_Logged,string Estatus,string Idioma,string PalabraClave, int PageSize)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            int res = 0;
            string msg = "";
            try
            {
                System.Data.SqlClient.SqlDataReader reader;
                System.Data.SqlClient.SqlCommand sql;
                con.Open();
                sql = new System.Data.SqlClient.SqlCommand();
                sql.CommandText = "select dbo.obtener_TotalPag_BandejaA3_v2(" +
                    (Fecha1 == "" || Fecha1 == null ? ((object)DBNull.Value) + "null" : ("'" + Convert.ToDateTime(Fecha1) + "'")) +
                    "," + (Fecha2 == "" || Fecha2 == null ? (object)DBNull.Value + "null" : ("'" + Convert.ToDateTime(Fecha2) + "'")) +
                    "," + (Linea == "" || Linea == null ? (object)DBNull.Value + "null" : ("'" + Linea + "'")) +
                    "," + (Folio == "" || Folio == null ? (object)DBNull.Value + "null" : ("'" + Folio + "'")) +
                    "," + (TipoA3 == "" || TipoA3 == null ? (object)DBNull.Value + "null" : ("'" + TipoA3 + "'")) +
                    "," + (CWID == "" || CWID == null ? (object)DBNull.Value + "null" : ("'" + CWID + "'")) +
                    "," + (CWID_Logged == "" || CWID_Logged == null ? (object)DBNull.Value + "null" : ("'" + CWID_Logged + "'")) +
                    "," + (Estatus == "" || Estatus == null ? (object)DBNull.Value + "null" : ("'" + Estatus + "'")) +
                    "," + (Idioma == "" || Idioma == null ? (object)DBNull.Value + "null" : ("'" + Idioma + "'")) +
                    "," + (PalabraClave == "" || PalabraClave == null ? (object)DBNull.Value + "null" : ("'" + PalabraClave + "'")) +
                    "," + PageSize + ");";
                sql.Connection = con;
                using (reader = sql.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        if (int.TryParse(reader[0].ToString(), out res))
                        {
                            res = Convert.ToInt32(reader[0]);
                        }
                        else
                        {
                            msg = "No devuelve un valor esperado. Revisar la función en la base de datos.";
                        }
                    }
                    else
                    {
                        msg = "Error en ExecuteReader. Revisar la función en la base de datos.";
                    }
                }
                con.Close();
            }
            catch (Exception e)
            {
                ErrorLogger.Registrar(this, e.ToString(), msg);
            }
            return res;
        }

        public DataTable obtenerRegistros_BandejaA3_v2(string Fecha1, string Fecha2, string Linea, string Folio, string TipoA3,
           string CWID, string CWID_Logged, string Estatus, string Idioma, string PalabraClave, int PageIndex, int PageSize)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("obtenerRegistros_BandejaA3_v2", con);
                    cmd.Parameters.Add("@Fecha1", SqlDbType.DateTime).Value = Fecha1 == "" || Fecha1 == null ? (object)DBNull.Value : Convert.ToDateTime(Fecha1);
                    cmd.Parameters.Add("@Fecha2", SqlDbType.DateTime).Value = Fecha2 == "" || Fecha2 == null ? (object)DBNull.Value : Convert.ToDateTime(Fecha2);
                    cmd.Parameters.Add("@Linea", SqlDbType.VarChar).Value = Linea == "" || Linea == null ? (object)DBNull.Value : Linea;
                    cmd.Parameters.Add("@Folio", SqlDbType.VarChar).Value = Folio == "" || Folio == null ? (object)DBNull.Value : Folio;
                    cmd.Parameters.Add("@TipoA3", SqlDbType.VarChar).Value = TipoA3 == "" || TipoA3 == null ? (object)DBNull.Value : TipoA3;
                    cmd.Parameters.Add("@CWID", SqlDbType.VarChar).Value = CWID == "" || CWID == null ? (object)DBNull.Value : CWID;
                    cmd.Parameters.Add("@CWID_Logged", SqlDbType.VarChar).Value = CWID_Logged == "" || CWID_Logged == null ? (object)DBNull.Value : CWID_Logged;
                    cmd.Parameters.Add("@Estatus", SqlDbType.Int).Value = Estatus == "" || Estatus == null ? (object)DBNull.Value : Estatus;
                    cmd.Parameters.Add("@Idioma", SqlDbType.Int).Value = Idioma == "" || Idioma == null ? (object)DBNull.Value : Idioma;
                    cmd.Parameters.Add("@PalabraClave", SqlDbType.VarChar).Value = PalabraClave == "" || PalabraClave == null ? (object)DBNull.Value : PalabraClave;
                    cmd.Parameters.Add("@PageIndex", SqlDbType.Int).Value = PageIndex;
                    cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = PageSize;
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter adp = new SqlDataAdapter(cmd);
                    adp.Fill(dt);
                }
                if (dt.Columns[0].ToString() == "ErrorNumber")
                {
                    foreach (DataRow row in dt.Rows)
                    {
                        msg = "Error Number: " + row[0].ToString() + ", Severity: " + row[1].ToString() + ", State: " + row[2].ToString() +
                                ", Procedure: " + row[3].ToString() + " Line: " + row[4].ToString() + " Message: " + row[5].ToString();
                    }
                }
            }
            catch (Exception e)
            {
                ErrorLogger.Registrar(this, e.ToString(), msg);
            }
            return dt;
        }
    }
}