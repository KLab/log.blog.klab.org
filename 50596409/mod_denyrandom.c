#include "httpd.h"
#include "http_config.h"
#include "http_protocol.h"
#include "ap_config.h"

#include "http_log.h"
#include "apr_time.h"
#include <stdlib.h>

module AP_MODULE_DECLARE_DATA denyrandom_module;

static int denyrandom(request_rec *r){
    int msec = apr_time_msec(r->request_time);
    int *rate = (int *)ap_get_module_config(r->per_dir_config, &denyrandom_module);

    if(*rate < 1)
        return DECLINED;

    if(msec % *rate){
        ap_log_rerror(APLOG_MARK, APLOG_DEBUG, 0, r, "deny: msec = %d", msec);
        return HTTP_FORBIDDEN;
    }

    ap_log_rerror(APLOG_MARK, APLOG_DEBUG, 0, r, "allow: msec = %d", msec);
    return OK;
}

static void *create_dir_config(apr_pool_t *p, char *dir){
    int *rate = (int *)apr_palloc(p, sizeof(int));
    *rate = 0;
    return (void *)rate;
}

static const char *set_rate(cmd_parms *cmd, void *_rate, const char *s_rate){
    int *rate = (int *)_rate;

    *rate = atoi(s_rate);

    if(*rate < 1)
        return "specify natural number for rate";

    return NULL;
}

static const command_rec cmds[] = {
    AP_INIT_TAKE1("SetAllowrate",
                  set_rate,
                  NULL,
                  OR_LIMIT,
                  "specify deny access rate"),
    {NULL}
};

static void denyrandom_register_hooks(apr_pool_t *p)
{
    ap_hook_access_checker(denyrandom, NULL, NULL, APR_HOOK_MIDDLE);
}

/* Dispatch list for API hooks */
module AP_MODULE_DECLARE_DATA denyrandom_module = {
    STANDARD20_MODULE_STUFF,
    create_dir_config,         /* create per-dir    config structures */
    NULL,                      /* merge  per-dir    config structures */
    NULL,                      /* create per-server config structures */
    NULL,                      /* merge  per-server config structures */
    cmds,                      /* table of config file commands       */
    denyrandom_register_hooks  /* register hooks                      */
}; 
