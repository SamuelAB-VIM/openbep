using System.Reflection;
using Autodesk.Revit.UI;

namespace CanbimSync
{
    /// <summary>Adds a CANBIM tab with one button: Sync parameters.</summary>
    public class App : IExternalApplication
    {
        public Result OnStartup(UIControlledApplication app)
        {
            const string tab = "CANBIM";
            try { app.CreateRibbonTab(tab); } catch { /* tab already exists */ }
            var panel = app.CreateRibbonPanel(tab, "Parameters");
            var btn = new PushButtonData("CanbimSync", "Sync\nparameters", Assembly.GetExecutingAssembly().Location, typeof(SyncCommand).FullName)
            {
                ToolTip = "Make this model's shared parameters match the CANBIM binding list exported from the BEP Builder. Shows what will change before changing anything."
            };
            panel.AddItem(btn);
            return Result.Succeeded;
        }

        public Result OnShutdown(UIControlledApplication app) => Result.Succeeded;
    }
}
