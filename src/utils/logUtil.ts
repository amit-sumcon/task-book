// logUtil.ts

interface LogData {
    api_endpoint: string;
    api_response_time: number | null;
    cpu_usage: number;
    log_level: "INFO" | "ERROR" | "DEBUG" | "WARN";
    memory_usage: number;
    message: string;
    service_name?: string;
    status: string;
    timestamp?: string;
    user_id: string | null;
}

const logData = ({
    api_endpoint,
    api_response_time,
    cpu_usage,
    log_level,
    memory_usage,
    message,
    service_name = "user-service",
    status,
    timestamp = new Date().toISOString(),
    user_id,
}: LogData): LogData => {
    return {
        api_endpoint,
        api_response_time,
        cpu_usage,
        log_level,
        memory_usage,
        message,
        service_name,
        status,
        timestamp,
        user_id,
    };
};

export default logData;
