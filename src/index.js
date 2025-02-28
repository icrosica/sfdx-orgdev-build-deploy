const core = require('@actions/core');
const github = require('@actions/github');
var propertiesReader = require('properties-reader');
const dependencies = require('./utils/install-dependencies.js');
const sfdx = require('./utils/sfdx.js');

try {
  
  core.debug("=== index.js ===");
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  core.debug(`The event payload: ${payload}`);
  
  //Variables declaration
  var cert = {};
  var login = {};
  var deploy = {};

  //Install dependecies  
  dependencies.install();
  
  //Load cert params
  cert.certificatePath = core.getInput('certificate_path');
  cert.decryptionKey = core.getInput('decryption_key');
  cert.decryptionIV = core.getInput('decryption_iv');

  //Load login params
  login.clientId = core.getInput('client_id');
  login.orgType = core.getInput('type');
  login.username = core.getInput('username');
  
  //Load deploy params
  deploy.defaultSourcePath = core.getInput('default_source_path');
  deploy.defaultTestClass = core.getInput('default_test_class');
  deploy.manifestToDeploy = core.getInput('manifest_path');
  deploy.sfdxRootFolder = core.getInput('sfdx_root_folder');
  deploy.currentBranch = core.getInput('current_branch');
  deploy.targetBranch = core.getInput('target_branch');
  deploy.destructivePath = core.getInput('destructive_path');
  deploy.dataFactory = core.getInput('data_factory');
  deploy.checkonly = (core.getInput('checkonly') === 'true' )? true : false;
  deploy.testlevel = core.getInput('deploy_testlevel');
  deploy.deployWaitTime = core.getInput('deploy_wait_time') || '60'; // Default wait time is 60 minutes
  
  //Login to Org
  sfdx.login(cert,login);

  //Convert from Source to Org Dev
  sfdx.convertion(deploy);
  
  //Deply/Checkonly to Org
  sfdx.deploy(deploy, login);
  
  //Destructive deploy
  //sfdx.destructiveDeploy(deploy);

  //Executes data factory script
  //sfdx.dataFactory(deploy);
  
} catch (error) {
  core.setFailed(error.message);
}

