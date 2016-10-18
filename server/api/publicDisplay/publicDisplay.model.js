'use strict';

import mongoose from 'mongoose';

var PublicDisplaySchema = new mongoose.Schema({
  isReady: Boolean
});

export default mongoose.model('PublicDisplay', PublicDisplaySchema);
