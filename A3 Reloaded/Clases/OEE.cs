using Antlr.Runtime.Misc;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.Globalization;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Clases
{
    public class OEE
    {
        public DataTable obtener_top5Fallas(string Linea)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_OEE"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand com = new SqlCommand("select top(10) CONVERT (varchar(10), Fecha_reg, 103) as Fecha,Linea,Maquina,Motivo,SUM(Minutos) as 'Minutos', ClasificacionParo from OAEV3RegistroParos where Fecha_reg > DATEADD(Month,-2,getdate()) and CONVERT (varchar(10), Fecha_reg, 103) < CONVERT (varchar(10), GETDATE(), 103) \r\nand ClasificacionParo like('%\\Paro no Planeado\\Equipo (AKZ)%') and Linea = '"+Linea+"' group by CONVERT (varchar(10), Fecha_reg, 103),Motivo,Linea,Maquina,ClasificacionParo order by SUM(Minutos) desc", con);
                    SqlDataAdapter da = new SqlDataAdapter(com);
                    da.Fill(dt);
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
        public DataTable obtener_eventos_falla(string fecha, string Linea,string maquina, string motivo,string clasificacion)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_OEE"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand com = new SqlCommand("select CONVERT (varchar(10), Fecha_reg, 103) as Fecha,Linea,Maquina,Motivo,Minutos, ClasificacionParo,Comentario from OAEV3RegistroParos \r\nwhere CONVERT (varchar(10), Fecha_reg, 103)  = '"+fecha+"' \r\nand Linea ='"+Linea+"' \r\nand Maquina = '"+maquina+"' \r\nand Motivo = '"+motivo+"' \r\nand ClasificacionParo = '"+clasificacion+"'", con);
                    SqlDataAdapter da = new SqlDataAdapter(com);
                    da.Fill(dt);
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
        public DataTable get_list_failure_mode_category(string is_enable)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_list_failure_mode_category", con);
                    cmd.Parameters.Add("@is_enable", SqlDbType.Int).Value = is_enable;
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
        public DataTable get_list_failure_mode_by_id_category(string id_category,string is_enable)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString);
            var msg = "";
            DataTable dt = new DataTable();
            try
            {
                using (con)
                {
                    SqlCommand cmd = new SqlCommand("get_list_failure_mode_by_id_category", con);
                    cmd.Parameters.Add("@id_category", SqlDbType.Int).Value = id_category;
                    cmd.Parameters.Add("@is_enable", SqlDbType.Int).Value = is_enable;
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