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
    public class Secciones
    {
        public DataTable get_template_sections_by_id_cuadrant(int id_cuadrant)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_template_sections_by_id_cuadrant", con);
                    cmd.Parameters.Add("@id_cuadrant", SqlDbType.Int).Value = id_cuadrant;

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
        public DataTable obtener_SeccionID(int ID)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("get_Seccion_ID", conn);
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
        public int obtener_TotalPagSeccion(string Nombre,string Descripcion, string Posicion, string Cuadrante,string Template,string Activo,int PageSize)
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
                sql.CommandText = "select dbo.get_TotalPag_Secciones(" + (Nombre == "" || Nombre == null ? (object)DBNull.Value + "null" : ("'" + Nombre + "'")) +
                    "," + (Descripcion == "" || Descripcion == null ? (object)DBNull.Value + "null" : Descripcion) +
                    "," + (Posicion == "" || Posicion == null ? (object)DBNull.Value + "null" : Posicion) +
                    "," + (Cuadrante == "" || Cuadrante == null ? (object)DBNull.Value + "null" : Cuadrante) +
                    "," + (Template == "" || Template == null ? (object)DBNull.Value + "null" : Template) +
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
        public DataTable mostrar_Secciones(string Nombre, string Descripcion, string Posicion, string Cuadrante, string Template, string Activo, int PageIndex, int PageSize)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_Secciones", con);
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = Nombre == "" || Nombre == null ? (object)DBNull.Value : Nombre;
                    cmd.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = Descripcion == "" || Descripcion == null ? (object)DBNull.Value : Descripcion;
                    cmd.Parameters.Add("@Posicion", SqlDbType.Int).Value = Posicion == "" || Posicion == null ? (object)DBNull.Value : Convert.ToSingle(Posicion, CultureInfo.CreateSpecificCulture("en-US"));
                    cmd.Parameters.Add("@Cuadrante", SqlDbType.Int).Value = Cuadrante == "" || Cuadrante == null ? (object)DBNull.Value : Convert.ToSingle(Cuadrante, CultureInfo.CreateSpecificCulture("en-US"));
                    cmd.Parameters.Add("@Template", SqlDbType.Int).Value = Template == "" || Template == null ? (object)DBNull.Value : Convert.ToSingle(Template, CultureInfo.CreateSpecificCulture("en-US"));
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
        public string registrar_Seccion(string Nombre,string Descripcion, int Posicion, int Cuadrante,int Template, int Activo)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("insert_Seccion", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = Nombre;
                    cmd.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = Descripcion;
                    cmd.Parameters.Add("@Posicion", SqlDbType.Int).Value = Posicion;
                    cmd.Parameters.Add("@Cuadrante", SqlDbType.Int).Value = Cuadrante;
                    cmd.Parameters.Add("@Template", SqlDbType.Int).Value = Template;
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
        public string remove_section(int id_seccion)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("remove_section", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@id_seccion", SqlDbType.Int).Value = id_seccion;
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
        public string actualizar_Seccion(int ID, string Nombre, string Descripcion, int Posicion, int Cuadrante, int Template, int Activo)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("update_Seccion", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = ID;
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = Nombre;
                    cmd.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = Descripcion;
                    cmd.Parameters.Add("@Posicion", SqlDbType.Int).Value = Posicion;
                    cmd.Parameters.Add("@Cuadrante", SqlDbType.Int).Value = Cuadrante;
                    cmd.Parameters.Add("@Template", SqlDbType.Int).Value = Template;
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
        public DataTable obtener_Seccion_TemplateID(int ID)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("get_secciones_template", conn);
                    cmd.Parameters.Add("@Te_id", SqlDbType.Int).Value = ID;
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