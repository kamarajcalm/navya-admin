import { getReferrer }  from '../../../utils';

const rfrSetPwdCnfg = {};

rfrSetPwdCnfg.default = () => ({

  ruleCndtns: () => ({
    minimumLength: 9
  }),

  /*
    Note:
    To set the order of the "rule-messages" for ANY referrer
    * go to the "rulesFrmNmeAndSeqMap"  for THAT referrer. (eg here it is default and it applies to all referrers)
      (* if u want to set for wiproge for eg: then add "rfrSetPwdCnfg.wiproge" and make changes there)
    * change/set the order of the rules in the array
    * the "key" is the formKey name. "values" are list of set-password-rules
    * ONLY THE RULES MENTIONED IN THIS ARRAY (FOR THE SET-referrer) WILL BE "CONSIDERED" FOR VALIDATION
    * for eg: for the password field in "register" form, we have the following rules in this order : ['minimumLength', 'mustContainNumber', 'uniqueCharacter', 'notContainsFNameOrLName'],
    * and for password field in say "resetpassword", form we have the default rule in this order : i.e ['minimumLength', 'mustContainNumber', 'uniqueCharacter']
    * the order of rules can be changed. Based on the order, the messages associated with that rule will get displayed in the UI
    * There SHOULD BE A FUNCTION HAVING THE SAME NAME AS THE RULE, PLEASE REFER './helpers.js' file to see for 'minimumLength', 'mustContainNumber', 'uniqueCharacter' and 'notContainsFNameOrLName'.
  */

  rulesFrmNmeAndSeqMap: {
    default: ['minimumLength', 'mustContainNumber', 'mustContainLowerCase', 'mustContainUpperCase', 'mustContainSpecialChar', 'invalidCharacters']
  },

  pwdVldtnRuleAndMsgMapMaster: () => {
    return {
      minimumLength: `Password must contain 9 or more characters.`,
      mustContainNumber: 'Password must contain a number.',
      mustContainLetter: 'Password must contain a letter.',
      mustContainUpperCase: 'Password must contain an uppercase letter.',
      mustContainLowerCase: 'Password must contain a lowercase letter.',
      mustContainSpecialChar: 'Password must contain a special character.',
      invalidCharacters: `Password must not contain invalid characters like ; < > \ { } [ ] + = ? & , : ' " \``
    };
  }
});

export const getValidationRulesUtils = (formKey='default') => {

  // get referrer
  const referrer = getReferrer();

  const rfrSetPwdCnfgDefault = rfrSetPwdCnfg.default();

  /*
    - gets referrer from rfrSetPwdCnfg.
    - if referrer is absent from rfrSetPwdCnfg, then 'default' config is taken
  */
  const rfrSetPwdCnfgObj = (rfrSetPwdCnfg[referrer] && rfrSetPwdCnfg[referrer]()) || rfrSetPwdCnfgDefault;

  const ruleCndtns = rfrSetPwdCnfgObj.ruleCndtns || rfrSetPwdCnfgDefault.ruleCndtns;

  const pwdVldtnRuleAndMsgMapMaster = rfrSetPwdCnfgObj.pwdVldtnRuleAndMsgMapMaster || rfrSetPwdCnfgDefault.pwdVldtnRuleAndMsgMapMaster;

  // if "formKey" exists in rfrSetPwdCnfg.rulesFrmNmeAndSeqMap use it else use "default" rules
  const rfrSetPwdCnfgRulesOrder = rfrSetPwdCnfgObj.rulesFrmNmeAndSeqMap[formKey] || rfrSetPwdCnfgObj.rulesFrmNmeAndSeqMap.default;

  /*
    This function returns
    (1) rulesMsgMap: Object map of "rule-name" and "rule-message" (associated with that rule) for that specfic referrer.
    (2) rulesMsgList: A List of "rule-messages" the gets shown in the UI for that specific referrer
  */

  const setValidationRules = () => {

    const rulesMsgMap = {}; const rulesMsgList = [];
    const ruleMapMaster = pwdVldtnRuleAndMsgMapMaster();

    rfrSetPwdCnfgRulesOrder.map((rule) => {
      rulesMsgMap[rule] = ruleMapMaster[rule];
      rulesMsgList.push(rulesMsgMap[rule]);
    })

    return { rulesMsgMap, rulesMsgList };
  }

  return { ...setValidationRules(), ruleCndtns: ruleCndtns() };
}
