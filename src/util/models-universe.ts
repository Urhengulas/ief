import {
  BoaviztaCpuImpactModel,
  BoaviztaCloudImpactModel,
  CloudCarbonFootprint,
  ShellModel,
  SciMModel,
  SciOModel,
  TeadsAWS,
  TeadsCurveModel,
  SciModel,
  EshoppenModel,
  EshoppenCpuModel,
  EshoppenMemModel,
  EshoppenNetModel,
  EMemModel,
  SciAccentureModel,
  EAvevaModel,
  SciEModel,
} from '../lib';

import {
  GraphOptions,
  ImplInitializeModel,
  InitalizedModels,
} from '../types/models-universe';

/**
 * Models Initialization Lifecycle.
 */
export class ModelsUniverse {
  /**
   * Models list.
   */
  public initalizedModels: InitalizedModels = {};

  /**
   * Gets model class by provided `name` param.
   */
  private handBuiltinModel(name: string) {
    switch (name) {
      case 'boavizta-cpu':
        return BoaviztaCpuImpactModel;
      case 'boavizta-cloud':
        return BoaviztaCloudImpactModel;
      case 'ccf':
        return CloudCarbonFootprint;
      case 'teads-aws':
        return TeadsAWS;
      case 'teads-curve':
        return TeadsCurveModel;
      case 'sci-e':
        return SciEModel;
      case 'sci-m':
        return SciMModel;
      case 'sci-o':
        return SciOModel;
      case 'sci':
        return SciModel;
      case 'eshoppen':
        return EshoppenModel;
      case 'eshoppen-net':
        return EshoppenNetModel;
      case 'eshoppen-cpu':
        return EshoppenCpuModel;
      case 'eshoppen-mem':
        return EshoppenMemModel;
      case 'sci-accenture':
        return SciAccentureModel;
      case 'emem':
        return EMemModel;
      case 'aveva':
        return EAvevaModel;
      default: // cover default
        return BoaviztaCpuImpactModel;
    }
  }

  /**
   * Returns plugin model.
   * @todo Update function when plugin model will ready.
   */
  private handPluginModel() {
    return ShellModel;
  }

  /**
   * Returns shell model.
   */
  private handShellModel() {
    return ShellModel;
  }

  /**
   * Gets model based on `name` and `kind` params.
   */
  private handModelByCriteria(name: string, kind: string) {
    switch (kind) {
      case 'builtin':
        return this.handBuiltinModel(name);
      case 'plugin':
        return this.handPluginModel();
      case 'shell':
        return this.handShellModel();
      default: // cover default
        return this.handBuiltinModel(name);
    }
  }

  /**
   * Initializes and registers model.
   */
  public writeDown(model: ImplInitializeModel) {
    const {name, kind, config} = model;

    const Model = this.handModelByCriteria(name, kind);

    const callback = async (graphOptions: GraphOptions) => {
      const params = {
        ...config,
        ...graphOptions,
      };

      const initalizedModel = await new Model().configure('test', params);

      return initalizedModel;
    };

    this.initalizedModels = {
      ...this.initalizedModels,
      [name]: callback,
    };

    return this.initalizedModels;
  }

  /**
   * Returns existing model by `name`.
   */
  public async getInitializedModel(modelName: string, config: any) {
    return await this.initalizedModels[modelName](config);
  }
}
