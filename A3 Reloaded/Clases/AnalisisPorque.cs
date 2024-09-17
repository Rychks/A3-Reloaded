using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Clases
{
    public class AnalisisPorque
    {
        public DataTable obtener_analisis_porque_ID(int ID)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_analisis_porque_id", con);
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = ID;
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
        public string Modificar_analisis(int ID, string Titulo, string Descripcion)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("update_analisis", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = ID;
                    cmd.Parameters.Add("@Titulo", SqlDbType.VarChar).Value = Titulo;
                    cmd.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = Descripcion;
                    var ultimoId = cmd.Parameters.Add("@ultimoId", SqlDbType.Int);
                    ultimoId.Direction = ParameterDirection.ReturnValue;
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    conn.Close();
                    var result = ultimoId.Value;
                    msg = result.ToString();
                }
            }
            catch (Exception e)
            {
                ErrorLogger.Registrar(this, e.ToString(), "SQL: " + msg);
            }
            return msg;
        }
        public string registrar_analisis_porque(string Titulo, string Descripcion)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("insert_analisis_porque", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Titulo", SqlDbType.VarChar).Value = Titulo;
                    cmd.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = Descripcion;
                    var ultimoId = cmd.Parameters.Add("@ultimoId", SqlDbType.Int);
                    ultimoId.Direction = ParameterDirection.ReturnValue;
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    conn.Close();
                    var result = ultimoId.Value;
                    msg = result.ToString();
                }
            }
            catch (Exception e)
            {
                ErrorLogger.Registrar(this, e.ToString(), "SQL: " + msg);
            }
            return msg;
        }
        public string remover_analisis(string ID, string ID_Item)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("eliminar_item_analisis", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = ID;
                    cmd.Parameters.Add("@ID_Item", SqlDbType.Int).Value = ID_Item;
                    SqlDataAdapter adp = new SqlDataAdapter(cmd);
                    adp.Fill(dt);
                }
                foreach (DataRow row in dt.Rows)
                {
                    if (row[0].ToString() != "guardado")
                    {
                        msg = "Error Number: " + row[0].ToString() + ", Severity: " + row[1].ToString() + ", State: " + row[2].ToString() +
                            ", Procedure: " + row[3].ToString() + " Line: " + row[4].ToString() + " Message: " + row[5].ToString();
                    }
                    else
                    {
                        msg = row[0].ToString();
                    }
                }
            }
            catch (Exception e)
            {
                ErrorLogger.Registrar(this, e.ToString(), "SQL: " + msg);
            }
            return msg;
        }
    }
}