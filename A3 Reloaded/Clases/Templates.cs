using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Configuration;

namespace A3_Reloaded.Clases
{
    public class Templates
    {
        public bool enviarCorreo(string Destino, string Asunto, string Mensaje, string Adjunto, MemoryStream Archivo, string CC = null)
        {
            var fromAddress = new MailAddress(WebConfigurationManager.AppSettings["Mail_System"]);
            var toAddress = new MailAddress(Destino);
            //const string fromPassword = "fromPassword";
            try
            {
                var smtp = new SmtpClient
                {
                    Host = WebConfigurationManager.AppSettings["Mail_Host"],
                    Port = Convert.ToInt32(WebConfigurationManager.AppSettings["Mail_Port"]),
                    EnableSsl = false,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    //Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                };
                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = Asunto,
                    IsBodyHtml = true,
                    Body = Mensaje.Replace("*S*", "<br/>")
                })
                {
                    if (Adjunto != null)
                    {
                        Attachment attachment = new Attachment(Archivo, Adjunto);
                        message.Attachments.Add(attachment);
                    }
                    if (CC != null && CC != "")
                    {
                        message.CC.Add(CC);
                    }
                    smtp.Send(message);
                    return true;
                }
            }
            catch (Exception e)
            {
                ErrorLogger.Registrar(this, e.ToString());
                return false;
            }
        }
        public DataTable obtener_Estatus_cuadrante_running(int ID_Template, string Nombre)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("obtener_Estatus_cuadrante_running", conn);
                    cmd.Parameters.Add("@ID_Template", SqlDbType.Int).Value = ID_Template;
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = Nombre;
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
        public DataTable obtener_info_cuadrante(int ID_Template, string Nombre)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("get_cuadrante_info_template_ID", conn);
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = ID_Template;
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = Nombre;
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
        public DataTable obtener_TemplateID(int ID)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("get_Template_ID", conn);
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
        public DataTable obtener_cuadranteID(int ID)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("get_cuadrante_id", conn);
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
        public int obtener_TotalPagTemplates(string Folio, string TipoA3,string Idioma, string Version, string Activo, int PageSize)
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
                sql.CommandText = "select dbo.get_TotalPag_Templates(" + (Folio == "" || Folio == null ? (object)DBNull.Value + "null" : ("'" + Folio + "'")) +
                    "," + (TipoA3 == "" || TipoA3 == null ? (object)DBNull.Value + "null" : TipoA3) +
                    "," + (Idioma == "" || Idioma == null ? (object)DBNull.Value + "null" : Idioma) +
                    "," + (Version == "" || Version == null ? (object)DBNull.Value + "null" : Version) +
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
        public DataTable mostrar_Templates(string Folio, string TipoA3, string Idioma, string Version, string Activo, int PageIndex, int PageSize)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_Templates", con);
                    cmd.Parameters.Add("@Folio", SqlDbType.VarChar).Value = Folio == "" || Folio == null ? (object)DBNull.Value : Folio;
                    cmd.Parameters.Add("@TipoA3", SqlDbType.Int).Value = TipoA3 == "" || TipoA3 == null ? (object)DBNull.Value : Convert.ToSingle(TipoA3, CultureInfo.CreateSpecificCulture("en-US"));
                    cmd.Parameters.Add("@Idioma", SqlDbType.Int).Value = Idioma == "" || TipoA3 == null ? (object)DBNull.Value : Convert.ToSingle(Idioma, CultureInfo.CreateSpecificCulture("en-US"));
                    cmd.Parameters.Add("@Version", SqlDbType.Int).Value = Version == "" || Version == null ? (object)DBNull.Value : Convert.ToSingle(Version, CultureInfo.CreateSpecificCulture("en-US"));
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
        public string registrar_Template(string Folio, int TipoA3, int Version,int Idioma, int Activo, string Descripcion, string Imagen)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("insert_Template", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Folio", SqlDbType.VarChar).Value = Folio;
                    cmd.Parameters.Add("@TipoA3", SqlDbType.Int).Value = TipoA3;
                    cmd.Parameters.Add("@Idioma", SqlDbType.Int).Value = Idioma;
                    cmd.Parameters.Add("@Version", SqlDbType.Int).Value = Version;
                    cmd.Parameters.Add("@Activo", SqlDbType.Int).Value = Activo;                  
                    cmd.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = Descripcion;
                    cmd.Parameters.Add("@Imagen", SqlDbType.VarChar).Value = Imagen;
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
        public string modificar_cuadrante(string Descripcion, int ID)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("update_cuadrante", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = Descripcion;
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = ID;
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
        public DataTable obtener_TiposA3(string Activo)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("get_Tipos_A3", conn);
                    cmd.Parameters.Add("@Activo", SqlDbType.Int).Value = Activo == "" || Activo == null ? (object)DBNull.Value : Convert.ToSingle(Activo, CultureInfo.CreateSpecificCulture("en-US"));
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
        public DataTable obtener_Cuadrantes(string Activo)
        {
            var msg = "";
            var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
            DataTable dt = new DataTable();
            try
            {
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("get_Cuadrantes", conn);
                    cmd.Parameters.Add("@Activo", SqlDbType.Int).Value = Activo == "" || Activo == null ? (object)DBNull.Value : Convert.ToSingle(Activo, CultureInfo.CreateSpecificCulture("en-US"));
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
        public string actualizar_Template(int ID, string Folio, int TipoA3, int Version, int Activo, string Descripcion, string Imagen)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("update_Template", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = ID;
                    cmd.Parameters.Add("@Folio", SqlDbType.VarChar).Value = Folio;
                    cmd.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = Descripcion;
                    cmd.Parameters.Add("@Imagen", SqlDbType.VarChar).Value = Imagen;
                    cmd.Parameters.Add("@TipoA3", SqlDbType.Int).Value = TipoA3;
                    cmd.Parameters.Add("@Version", SqlDbType.Int).Value = Version;
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
        public DataTable mostrar_Templates_Activo(string Idioma_ID)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_Templates_Activo", con);
                    cmd.Parameters.Add("@Idioma_ID", SqlDbType.Int).Value = Idioma_ID;
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
        public DataTable obtener_cuadrantes_template_id(int ID)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_cuadrantes_template_id", con);
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
        public string obtener_folio_template()
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            string msg = "";
            try
            {
                System.Data.SqlClient.SqlDataReader reader;
                System.Data.SqlClient.SqlCommand sql;
                con.Open();
                sql = new System.Data.SqlClient.SqlCommand();
                sql.CommandText = "select dbo.obtener_folio_template();";
                sql.Connection = con;
                using (reader = sql.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        msg = reader[0].ToString();
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
            return msg;
        }
        public string obtener_cuadrante_running_ID(int ID)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            string msg = "";
            try
            {
                System.Data.SqlClient.SqlDataReader reader;
                System.Data.SqlClient.SqlCommand sql;
                con.Open();
                sql = new System.Data.SqlClient.SqlCommand();
                sql.CommandText = "select dbo.obtener_cuadrante_running_ID(" + ID + ");";
                sql.Connection = con;
                using (reader = sql.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        msg = reader[0].ToString();
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
            return msg;
        }
        public string set_estatus_cuadrante_running(int Estatus,int ID_Template,string Nombre)
        {
            var msg = "";
            try
            {
                DataTable dt = new DataTable();
                var constr = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (var conn = new SqlConnection(constr))
                {
                    SqlCommand cmd = new SqlCommand("ser_estatus_cuadrante", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Estatus", SqlDbType.Int).Value = Estatus;
                    cmd.Parameters.Add("@ID_Template", SqlDbType.Int).Value = ID_Template;
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = Nombre;
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