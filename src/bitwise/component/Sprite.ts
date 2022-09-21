
import * as bitecs from 'bitecs';
import Component from '../Component.ts';

export default class Sprite extends Component {
  get componentData() {
    return {
      textureId: bitecs.Types.ui8,
    }
  }
  freezeEntity( eid:Number ) {
    const data = super.freezeEntity(eid);
    data.texturePath = this.scene.game.texturePaths[data.textureId];
    delete data.textureId;
    return data;
  }
  thawEntity( eid:Number, data:Object ) {
    this.scene.game.loadTexture( data.texturePath );
    const textureId = this.scene.game.textureIds[ data.texturePath ];
    super.thawEntity( eid, {textureId} );
  }
}
