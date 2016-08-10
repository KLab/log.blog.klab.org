#include "httpd.h"
#include "http_config.h"
#include "http_protocol.h"
#include "ap_config.h"

#include "http_log.h"
#include "apr_time.h"

#define RATE 10

static int denyrandom(request_rec *r){
    int msec = apr_time_msec(r->request_time);
    if(msec % RATE){
        ap_log_rerror(APLOG_MARK, APLOG_DEBUG, 0, r, "deny: msec = %d", msec);
        return HTTP_FORBIDDEN;
    }

    ap_log_rerror(APLOG_MARK, APLOG_DEBUG, 0, r, "allow: msec = %d", msec);
    return OK;
}

static void denyrandom_register_hooks(apr_pool_t *p)
{
    ap_hook_access_checker(denyrandom, NULL, NULL, APR_HOOK_MIDDLE);
}

/* Dispatch list for API hooks */
module AP_MODULE_DECLARE_DATA denyrandom_module = {
    STANDARD20_MODULE_STUFF, 
    NULL,                  /* create per-dir    config structures */
    NULL,                  /* merge  per-dir    config structures */
    NULL,                  /* create per-server config structures */
    NULL,                  /* merge  per-server config structures */
    NULL,                  /* table of config file commands       */
    denyrandom_register_hooks  /* register hooks                      */
};

