import path from 'path';
import Conf from 'conf';

export const config = new Conf({
  projectName: 'langhub',
  cwd: path.join(process.env.HOME || process.env.USERPROFILE, '._langhub_')
});
