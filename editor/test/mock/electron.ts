/**
 * This is a simple mock object imitating the API exposed to the
 * Electron renderer process as the 'electron' global. This is set up in
 * the Electron preload scripts.
 *
 * When using this, you should use `jest.fn()` to build a mock for your
 * specific test and replace the global function(s) as needed.
 */
class MockElectron {
  store:MockStore = new MockStore();
  isMac:boolean = false;
  isLinux:boolean = false;
  isWindows:boolean = false;
  resourcesPath():Promise<string> {
    return new Promise( () => "" );
  }
  openProject():Promise<OpenDialog> {
    return new Promise( () => ({ canceled: false, filePaths: [] }) );
  }
  newProject():Promise<SaveDialog> {
    return new Promise( () => ({ canceled: false, filePath: "" }) );
  }
  readProject(path:string):Promise<DirectoryItem[]> {
    return new Promise( () => [] );
  }
  readFile(path: string):Promise<string> {
    return new Promise( () => "" );
  }
  newFile( path:string, name:string, ext:string, data:any ):Promise<SaveDialog> {
    return new Promise( () => ({ canceled: false, filePath: "" }) );
  }
  saveFile( path:string, data:any ):Promise<SaveDialog> {
    return new Promise( () => ({ canceled: false, filePath: "" }) );
  }
  on( channel:string, cb:Function ) {
    return null;
  }
  removeListener( channel:string, cb:Function ) {
    return null;
  }
  deleteTree( root:string, path:string ):Promise<any> {
    return new Promise( () => null );
  }
  renamePath( root:string, path:string, dest:string ):Promise<any> {
    return new Promise( () => null );
  }
  buildProject( root:string ):Promise<string> {
    return new Promise( () => "" );
  }
  releaseProject( root:string, type:string ):Promise<string> {
    return new Promise( () => "" );
  }
  openEditor( root:string, file:string ):Promise<string> {
    return new Promise( () => "" );
  }
  listExamples():Promise<string[]> {
    return new Promise( () => [""] );
  }
  importFiles( root:string ):Promise<undefined[]> {
    return new Promise( () => ({canceled: false, filePaths: [""] }) );
  }
};

class MockStore {
  data:{ [key:string]: { [key:string]: any } } = {};
  get( file:string, key:string, defaultValue:any ):any {
    return this.data[file]?.[key] ?? defaultValue;
  }
  set( file:string, key:string, val:any ) {
    if ( !this.data[file] ) {
      this.data[file] = {};
    }
    this.data[file][key] = val;
  }
}

export { MockElectron, MockStore };
