const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/../proto/cas_server.proto";

const CONFIG = {
  grpcCASServerUrl: "192.168.1.106:10001"
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const { cas } = grpc.loadPackageDefinition(packageDefinition);

const client = new cas.CASServer(
  CONFIG.grpcCASServerUrl,
  grpc.credentials.createInsecure()
);

function ticketValidation(call) {
  return new Promise((resolve, reject) => {
    client.ticketValidation(call, function(err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
}

function removeServiceTicket(call) {
  return new Promise((resolve, reject) => {
    client.RemoveServiceTicket(call, function(err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
}

async function init() {
  console.log('fit');
  const ticketValidationRes = await ticketValidation({
    ticket: "ST_3b22fdb1f000003"
  });
  // const removeServiceTicketRes = await removeServiceTicket({
  //   ticket: "ST_3b22d0ee0000003"
  // });
  console.info("ticketValidationRes", ticketValidationRes);
  // console.info("removeServiceTicketRes", removeServiceTicketRes);
}
init();

