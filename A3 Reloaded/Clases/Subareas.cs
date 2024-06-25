using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Clases
{
    public class Subareas
    {
        public int obtener_TotalPagSubareas(string Nombre, string Departamento, string Activo, int PageSize)
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
                sql.CommandText = "select dbo.obtener_TotalPag_registros_subareas(" + (Nombre == "" || Nombre == null ? (object)DBNull.Value + "null" : ("'" + Nombre + "'")) +
                    "," + (Departamento == "" || Departamento == null ? (object)DBNull.Value + "null" : Departamento) +
                    "," + (Activo == "" || Activo == null ? (object)DBNull.Value + "null" : Activo) +
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
        public DataTable mostrar_Subareas(string Nombre, string Departamento, string Activo, int PageIndex, int PageSize)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("obtener_registros_subarea", con);                   
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = Nombre == "" || Nombre == null ? (object)DBNull.Value : Nombre;
                    cmd.Parameters.Add("@Departamento", SqlDbType.Int).Value = Departamento == "" || Departamento == null ? (object)DBNull.Value : Convert.ToSingle(Departamento, CultureInfo.CreateSpecificCulture("en-US"));
                    cmd.Parameters.Add("@Activo", SqlDbType.Int).Value = Activo == "" || Activo == null ? (object)DBNull.Value : Convert.ToSingle(Activo, CultureInfo.CreateSpecificCulture("en-US"));
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
        public string registrar_Subarea(string Nombre, int Departamento, int Activo)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("registro_subarea", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = Nombre;
                    cmd.Parameters.Add("@Departamento", SqlDbType.Int).Value = Departamento;
                    cmd.Parameters.Add("@Activo", SqlDbType.Int).Value = Activo;
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
        public string actualizar_Subarea(int ID,string Nombre, int Departamento, int Activo)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("actualizar_subarea", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = ID;
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = Nombre;
                    cmd.Parameters.Add("@Departamento", SqlDbType.Int).Value = Departamento;
                    cmd.Parameters.Add("@Activo", SqlDbType.Int).Value = Activo;
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
        public DataTable obtener_lista_Subareas(int Activo)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("obtener_registro_subarea_lista", conn);
                    cmd.Parameters.Add("@Activo", SqlDbType.Int).Value = Activo;
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
                ErrorLogger.Registrar(this, e.ToString(), "SQL: " + msg);
            }
            return dt;
        }
        public DataTable obtener_Subarea_ID(int ID)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("obtener_registro_subarea_ID", conn);
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
                ErrorLogger.Registrar(this, e.ToString(), "SQL: " + msg);
            }
            return dt;
        }
    }
}