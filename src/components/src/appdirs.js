var os = require('os');
var path = require('path');

exports.userDataDir = userDataDir;

/**
 * Returns the full path to the user-specific data directory for the given
 * application.
 *
 * *  *application* is the name of the application. If it's not given, just the
 *    system directory is returned.
 * *  *author*, which is only used on Windows, is the name of the author of
 *    the application. It's usually the company name or something like that.
 *    You can pass any false value in order to disable it.
 * *  *version* is an optional version path element to append to the path.
 * *  *roaming* is a boolean indicating weather or not you want to use the
 *    roaming application data directory on Windows.
 */
function userDataDir(application, author, version, roaming) {
  var dir;
  var system = os.platform();

  if (system.substr(0, 3) === 'win') {
    if (!author) {
      author = application;
    }

    dir = _getWindowsFolder(roaming ? 'CSIDL_APPDATA' : 'CSIDL_LOCAL_APPDATA');

    if (application) {
      if (author) {
        dir = path.join(dir, author, application);
      } else {
        dir = path.join(dir, application);
      }
    }
  } else if (system === 'darwin') {
    dir = path.join(process.env.HOME, 'Library', 'Application Support');
    if (application) {
      dir = path.join(dir, application);
    }
  } else {
    if (process.env.XDG_DATA_HOME) {
      dir = process.env.XDG_DATA_HOME;
    } else {
      dir = path.join(process.env.HOME, '.local', 'share');
    }
    if (application) {
      dir = path.join(dir, application);
    }
  }

  if (application && version) {
    dir = path.join(dir, version);
  }

  return dir;
}

function _getWindowsFolder(dir) {
  /* TODO TODOWIN */
  throw new Error('Not implemented.');
}
