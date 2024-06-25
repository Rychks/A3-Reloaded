using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Clases
{
    public class AuditTrail
    {

        public int obtener_TotalPagAuditTrail(string Fecha1, string Fecha2, string Usuario, string Accion, string Anterior,
            string Actual, string Justificacion, int PageSize)
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
                sql.CommandText = "select dbo.get_TotalPag_AuditTrail(" +
                    (Fecha1 == "" || Fecha1 == null ? ((object)DBNull.Value) + "null" : ("'" + Convert.ToDateTime(Fecha1) + "'")) +
                    "," + (Fecha2 == "" || Fecha2 == null ? (object)DBNull.Value + "null" : ("'" + Convert.ToDateTime(Fecha2) + "'")) +
                    "," + (Usuario == "" || Usuario == null ? (object)DBNull.Value + "null" : ("'" + Usuario + "'")) +
                    "," + (Accion == "" || Accion == null ? (object)DBNull.Value + "null" : ("'" + Accion + "'")) +
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
        public DataTable Reporte_AuditTrail(string Fecha1, string Fecha2, string Usuario, string Accion)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_Reporte_AuditTrail", con);
                    cmd.Parameters.Add("@Fecha1", SqlDbType.DateTime).Value = Fecha1 == "" || Fecha1 == null ? (object)DBNull.Value : Convert.ToDateTime(Fecha1);
                    cmd.Parameters.Add("@Fecha2", SqlDbType.DateTime).Value = Fecha2 == "" || Fecha2 == null ? (object)DBNull.Value : Convert.ToDateTime(Fecha2);
                    cmd.Parameters.Add("@Usuario", SqlDbType.VarChar).Value = Usuario == "" || Usuario == null ? (object)DBNull.Value : Usuario;
                    cmd.Parameters.Add("@Accion", SqlDbType.VarChar).Value = Accion == "" || Accion == null ? (object)DBNull.Value : Accion;
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
        public DataTable mostrar_AuditTrail(string Fecha1, string Fecha2, string Usuario, string Accion,
            string Anterior, string Actual, string Justificacion, int PageIndex, int PageSize)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_AuditTrail", con);
                    cmd.Parameters.Add("@Fecha1", SqlDbType.DateTime).Value = Fecha1 == "" || Fecha1 == null ? (object)DBNull.Value : Convert.ToDateTime(Fecha1);
                    cmd.Parameters.Add("@Fecha2", SqlDbType.DateTime).Value = Fecha2 == "" || Fecha2 == null ? (object)DBNull.Value : Convert.ToDateTime(Fecha2);
                    cmd.Parameters.Add("@Usuario", SqlDbType.VarChar).Value = Usuario == "" || Usuario == null ? (object)DBNull.Value : Usuario;
                    cmd.Parameters.Add("@Accion", SqlDbType.VarChar).Value = Accion == "" || Accion == null ? (object)DBNull.Value : Accion;
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
        public string registrarAuditTrail(DateTime Fecha, string CWID, string Accion, string Anterior, string Actual, string Justificacion)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("insert_AuditTrail", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Fecha", SqlDbType.DateTime).Value = Fecha;
                    cmd.Parameters.Add("@CWID", SqlDbType.VarChar).Value = CWID;
                    cmd.Parameters.Add("@Accion", SqlDbType.VarChar).Value = Accion;
                    cmd.Parameters.Add("@Anterior", SqlDbType.VarChar).Value = Anterior;
                    cmd.Parameters.Add("@Actual", SqlDbType.VarChar).Value = Actual;
                    cmd.Parameters.Add("@Justificacion", SqlDbType.VarChar).Value = Justificacion;
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