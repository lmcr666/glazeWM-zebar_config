import React, {
  useRef,
  useState,
  useEffect,
} from 'https://esm.sh/react@18?dev';
import { createRoot } from 'https://esm.sh/react-dom@18/client?dev';
import * as zebar from 'https://esm.sh/zebar@2';
import { useScreenshot } from 'https://esm.sh/use-react-screenshot'



// const ColorThief = require(resolve(process.cwd(), "./color-thief-node.js"));
// var colorThief = new ColorThief();

const providers = zebar.createProviderGroup({
  network: { type: 'network', refreshInterval: '2000' },
  glazewm: { type: 'glazewm' },
  cpu: { type: 'cpu', refreshInterval: '1000' },
  date: { type: 'date', formatting: 'HH:mm:ss' },
  battery: { type: 'battery', refreshInterval: '10000' },
  memory: { type: 'memory', refreshInterval: '4000' },
  weather: { type: 'weather' },
});

createRoot(document.getElementById('root')).render(<App />);

function App() {
  const [output, setOutput] = useState(providers.outputMap);
  const [nowPlaying, setNowPlaying] = useState('');
  const processIcons = {
    sublime_text: "nf nf-seti-sublime",
    chrome: "nf nf-fa-chrome",
    Spotify: "nf nf-md-spotify",
    firefox: "nf nf-md-firefox",
    Discord: "nf nf-fa-discord",
    explorer: "nf nf-oct-file_directory",
    Telegram: "nf nf-fa-telegram",
    wezterm: "nf nf-oct-terminal",
    cmd: "nf nf-oct-terminal",
    pwsh: "nf nf-oct-terminal",
    powershell: "nf nf-oct-terminal",
    WindowsTerminal: "nf nf-oct-terminal",
    ConEmu: "nf nf-oct-terminal",
    ConEmu64: "nf nf-oct-terminal",
    'wezterm-gui': "nf nf-oct-terminal",
    Code: "nf nf-dev-code",
    floorp: "nf nf-oct-browser",
  };

  // const ref = useRef(null)
  // const [image, takeScreenshot] = useScreenshot()
  // const getImage = () => takeScreenshot(ref.current)

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));

    if (output.glazewm?.allWorkspaces) {
      output.glazewm.allWorkspaces.forEach((workspace) => {
        workspace.children?.forEach((child) => {
          if (child?.processName === "Spotify") {
            setNowPlaying(child.title === "Spotify Premium" ? '' : child.title);
          }
        });
      });
    }
  }, [output]);

  function getTitle() {
    return output.glazewm?.focusedContainer.type === 'window'
      ? output.glazewm?.focusedContainer.processName || ''
      : '';
  }

  function getWorkspaceIcon(workspace) {
    return workspace.hasFocus
      ? <span>{workspace.displayName || workspace.name}</span>
      : <span>{workspace.name}</span>;
  }

  // Change the color of the CPU bar based on usage.
  function getCpuUsageRate(cpuOutput) {
    if (cpuOutput.usage > 90) return 'extreme-usage';
    else if (cpuOutput.usage > 65) return 'high-usage';
    else if (cpuOutput.usage > 30) return 'medium-usage';
    else return 'low-usage';
  }

  // Change the color of the memory bar based on usage.
  function getMemoryUsageRate(memoryOutput) {
    if (memoryOutput.usage > 90) return 'extreme-usage';
    else if (memoryOutput.usage > 65) return 'high-usage';
    else if (memoryOutput.usage > 45) return 'medium-usage';
    else return 'low-usage';
  }

  // Get icon to show for current network status.
  function getNetworkIcon(networkOutput) {
    switch (networkOutput.defaultInterface?.type) {
      case 'ethernet':
        return <img src="./icons/icons8-wired-network-32.png" className="i-wifi" width="20" height="20"></img>;
      case 'wifi':
        if (networkOutput.defaultGateway?.signalStrength >= 75) {
          return <img src="./icons/icons8-wifi-3-32.png" className="i-wifi" width="20" height="20"></img>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 45
        ) {
          return <img src="./icons/icons8-wifi-2-32.png" className="i-wifi" width="20" height="20"></img>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 5
        ) {
          return <img src="./icons/icons8-wifi-1-32.png" className="i-wifi" width="20" height="20"></img>;
        } else {
          return <img src="./icons/icons8-no-network-32.png" className="i-eth" width="20" height="20"></img>;
        }
      default:
        return (
          <img src="./icons/icons8-no-network-32.png" className="i-eth" width="20" height="20"></img>
        );
    }
  }

  // Get icon to show for how much of the battery is charged.
  // removed bc i have no batery

  // Change the color of the battery bar based on how much of the battery is charged.

  // Get icon to show for current weather status.
  function getWeatherIcon(weatherOutput) {
    switch (weatherOutput.status) {
      case 'clear_day':
        return <i className="nf nf-weather-day_sunny"></i>;
      case 'clear_night':
        return <i className="nf nf-weather-night_clear"></i>;
      case 'cloudy_day':
        return <i className="nf nf-weather-day_cloudy"></i>;
      case 'cloudy_night':
        return <i className="nf nf-weather-night_alt_cloudy"></i>;
      case 'light_rain_day':
        return <i className="nf nf-weather-day_sprinkle"></i>;
      case 'light_rain_night':
        return <i className="nf nf-weather-night_alt_sprinkle"></i>;
      case 'heavy_rain_day':
        return <i className="nf nf-weather-day_rain"></i>;
      case 'heavy_rain_night':
        return <i className="nf nf-weather-night_alt_rain"></i>;
      case 'snow_day':
        return <i className="nf nf-weather-day_snow"></i>;
      case 'snow_night':
        return <i className="nf nf-weather-night_alt_snow"></i>;
      case 'thunder_day':
        return <i className="nf nf-weather-day_lightning"></i>;
      case 'thunder_night':
        return <i className="nf nf-weather-night_alt_lightning"></i>;
    }
  }

  function convertTimeStampToTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="app">
      <div className="left">
        <div className="template logo icons">
          <div
            className={`window-icon ${processIcons[output.glazewm?.focusedContainer.processName] ? 'has-icon' : ''}`}
            style={{ marginRight: processIcons[output.glazewm?.focusedContainer.processName] ? '6px' : '0' }}
          >
            {processIcons[output.glazewm?.focusedContainer.processName] ? (
              <i className={processIcons[output.glazewm?.focusedContainer.processName]}></i>
            ) : (
              <div className="template">
                
              </div>
            )}
          </div>
        </div>
        {output.glazewm && (
          <>
            <div className="workspaces">
              {output.glazewm.currentWorkspaces.map(workspace => (
                <button
                  className={`workspace ${workspace.hasFocus && 'focused'} ${workspace.isDisplayed && 'displayed'}`}
                  onClick={() =>
                    output.glazewm.runCommand(`focus --workspace ${workspace.name}`)
                  }
                  key={workspace.name}
                  id={workspace.name}
                >
                  {workspace.hasFocus ? (
                    <span className="workspace-icon">
                      {getTitle() || (workspace.displayName ? workspace.displayName : workspace.name)}
                    </span>
                  ) : (
                    getWorkspaceIcon(workspace)
                  )}
                </button>
              ))}
            </div>
            <div className="template">
              <button
                className={`toggle-tiling-direction ${output.glazewm.tilingDirection === 'horizontal' ? 'horizontal' : 'vertical'}`}
                onClick={() =>
                  output.glazewm.runCommand('toggle-tiling-direction')}>
                <span className="tiling-direction">
                  
                </span>
              </button>
            </div>
            <div className="template">
              {output.glazewm.bindingModes.map(bindingMode => (
                <span className="binding-mode">
                  {bindingMode.displayName ?? bindingMode.name}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="center">
        {output.glazewm && (
          <>
            {output.glazewm.focusedWorkspace.children.map(
              (window) =>
                window.hasFocus && (
                  <div className="current-window" key={window.id}>
                    {window.title.length > 90
                      ? window.title.slice(0, 90) + '...'
                      : window.title}
                  </div>
                ),
            )}
          </>
        )}
      </div>

      <div className="right">
        {nowPlaying && (
          <div className="now-playing" id="now-playing">
            <span>
              {nowPlaying}
            </span>
          </div>
        )}
        <div className="vl"></div>
        {output.cpu && (
          <button className={`cpu ${getCpuUsageRate(output.cpu)}`}>
            <span className="i-cpu">
              
            </span>
            <span className="cpu-bar">
              {Math.round(output.cpu.usage)}%
            </span>
          </button>
        )}
        {output.memory && (
          <button className={`memory ${getMemoryUsageRate(output.memory)}`}
            onClick={() => {
              output.glazewm.runCommand('shell-exec %ProgramFiles%/Mem Reduct/memreduct.exe')
            }}>
            <span className="i"></span>
            <div className="labels">
              <span className="label total">
                <span>USED</span>
                {Math.round(output.memory.usedMemory / 1024 / 1024 / 1024)}G
              </span>
              <span className="label total">
                <span>TOT</span>
                {Math.round(output.memory.totalMemory / 1024 / 1024 / 1024)}G
              </span>
            </div>
            <span className="mem-bar"> {Math.round(output.memory.usage)}%</span>
          </button>
        )}
        {output.weather && (
          <div id="weather" className="template weather">
            {getWeatherIcon(output.weather)}
            {Math.round(output.weather.celsiusTemp)}°C
          </div>
        )}
        {output.network && (
          <div className="template network">
            {getNetworkIcon(output.network)}
            {output.network.defaultGateway?.ssid}
          </div>
        )}

        {output.battery && (
          <div className={`template battery ${getBatteryUsageRate(output.battery)}`}>
            {getBatteryIcon(output.battery)}
            {Math.round(output.battery.chargePercent)}%
          </div>
        )}

        {output.date && (
          <div className="template date">
            <img src="./icons/icons8-time-32.png" className="i-time" width="17" height="17"></img>
            <span className="time">{output.date?.formatted}</span>
          </div>
        )}
      </div>
    </div>
  );
}