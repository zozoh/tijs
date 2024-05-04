import { ActionBarProps, Callback, TiEventTrigger } from '../../../core';
import { buildBarViewItems, buildItemsAncestors } from './action-bar-item';
import { BarState } from './action-bar-type';

/*-----------------------------------------------------

                   Props
                
-----------------------------------------------------*/
export type ActionBarOptions = {
  getRootElement: () => HTMLElement | undefined;
  notify: TiEventTrigger<string, any>;
  parseAction: (
    action: string,
    state: BarState,
    options: ActionBarOptions
  ) => Callback;
};
// /*-----------------------------------------------------

//                    Output Feature

// -----------------------------------------------------*/
// export type ActionBarFeature = {
//   className: Vars;
//   items: BuiltedBarItem[];
// };

/*-----------------------------------------------------

                   Use Feature
                
-----------------------------------------------------*/
export function useActionBar(
  state: BarState,
  props: ActionBarProps,
  options: ActionBarOptions
) {
  let hasOpenedGroup = false;
  for (let en of state.opened.entries()) {
    let [_key, val] = en;
    if (val) {
      hasOpenedGroup = true;
      break;
    }
  }
  let items = buildBarViewItems(state, props.items, options);
  let ancestors = buildItemsAncestors(items);
  return {
    hasOpenedGroup,
    className: { 'bar-top-group': true },
    items,
    ancestors,
  };
}
