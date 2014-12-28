#include "netroute.h"
#include "node.h"
#include "nan.h"

#include <errno.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/sysctl.h>
#include <net/if.h>
#include <net/route.h>

namespace netroute {

using namespace v8;
using namespace node;

static NAN_METHOD(GetInfo) {
  NanEscapableScope();

  Local<Object> result = NanNew<Object>();
  Local<Array> ipv4 = NanNew<Array>();
  Local<Array> ipv6 = NanNew<Array>();

  if (!GetInfo(AF_INET, ipv4))
    NanReturnUndefined();
  if (!GetInfo(AF_INET6, ipv6))
    NanReturnUndefined();

  result->Set(NanNew<String>("IPv4"), ipv4);
  result->Set(NanNew<String>("IPv6"), ipv6);

  NanReturnValue(result);
}


static void Init(Handle<Object> target) {
  NanScope();

  NODE_SET_METHOD(target, "getInfo", GetInfo);
}

NODE_MODULE(netroute, Init);

} // namespace netroute
