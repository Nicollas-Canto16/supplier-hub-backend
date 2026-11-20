import { AccessLogCreate } from '../dto/access-log.dto.js';

export abstract class AccessLogsRepositry {
  abstract create(accesslog: AccessLogCreate): Promise<void>;
}
