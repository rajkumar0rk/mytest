/*
 * Copyright (C) 2017 Oracle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.sun.xml.xsom;

import java.util.Collection;
import java.util.List;

import javax.xml.namespace.NamespaceContext;

import org.xml.sax.Locator;

import com.sun.xml.xsom.parser.SchemaDocument;
import com.sun.xml.xsom.visitor.XSFunction;
import com.sun.xml.xsom.visitor.XSVisitor;

/**
 * Base interface for all the schema components.
 * 
 * @author
 *  Kohsuke Kawaguchi (kohsuke.kawaguchi@sun.com)
 */
public interface XSComponent
{
    /** Gets the annotation associated to this component, if any. */
    XSAnnotation getAnnotation();

    /**
     * Works like {@link #getAnnotation()}, but allow a new empty {@link XSAnnotation} to be created
     * if not exist.
     *
     * @param createIfNotExist
     *      true to create a new {@link XSAnnotation} if it doesn't exist already.
     *      false to make this method behavel like {@link #getAnnotation()}.
     *
     * @return
     *      null if {@code createIfNotExist==false} and annotation didn't exist.
     *      Otherwise non-null.
     */
    XSAnnotation getAnnotation(boolean createIfNotExist);

    /**
     * Gets the foreign attributes on this schema component.
     *
     * <p>
     * In general, a schema component may match multiple elements
     * in a schema document, and those elements can individually
     * carry foreign attributes.
     *
     * <p>
     * This method returns a list of {@link ForeignAttributes}, where
     * each {@link ForeignAttributes} object represent foreign attributes
     * on one element.
     *
     * @return
     *      can be an empty list but never be null.
     */
    List<? extends ForeignAttributes> getForeignAttributes();

    /**
     * Gets the foreign attribute of the given name, or null if not found.
     *
     * <p>
     * If multiple occurences of the same attribute is found,
     * this method returns the first one.
     *
     * @see #getForeignAttributes()
     */
    String getForeignAttribute(String nsUri, String localName);

    /**
     * Gets the locator that indicates the source location where
     * this component is created from, or null if no information is
     * available.
     */
    Locator getLocator();

    /**
     * Gets a reference to the {@link XSSchema} object to which this component
     * belongs.
     * <p>
     * In case of <code>XSEmpty</code> component, this method
     * returns null since there is no owner component.
     */
    XSSchema getOwnerSchema();

    /**
     * Gets the root schema set that includes this component.
     *
     * <p>
     * In case of <code>XSEmpty</code> component, this method
     * returns null since there is no owner component.
     */
    XSSchemaSet getRoot();

    /**
     * Gets the {@link SchemaDocument} that indicates which document this component
     * was defined in.
     *
     * @return
     *      null for components that are built-in to XML Schema, such
     *      as anyType, or "empty" {@link XSContentType}. This method also
     *      returns null for {@link XSSchema}.
     *      For all other user-defined
     *      components this method returns non-null, even if they are local.
     */
    SchemaDocument getSourceDocument();

    /**
     * Evaluates a schema component designator against this schema component
     * and returns the resulting schema components.
     *
     * @throws IllegalArgumentException
     *      if SCD is syntactically incorrect.
     *
     * @param scd
     *      Schema component designator. See {@link SCD} for more details.
     * @param nsContext
     *      The namespace context in which SCD is evaluated. Cannot be null.
     * @return
     *      Can be empty but never null.
     */
    Collection<XSComponent> select(String scd, NamespaceContext nsContext);

    /**
     * Evaluates a schema component designator against this schema component
     * and returns the first resulting schema component.
     *
     * @throws IllegalArgumentException
     *      if SCD is syntactically incorrect.
     *
     * @param scd
     *      Schema component designator. See {@link SCD} for more details.
     * @param nsContext
     *      The namespace context in which SCD is evaluated. Cannot be null.
     * @return
     *      null if the SCD didn't match anything. If the SCD matched more than one node,
     *      the first one will be returned.
     */
    XSComponent selectSingle(String scd, NamespaceContext nsContext);

    /**
     * Accepts a visitor.
     */
    void visit( XSVisitor visitor );
    /**
     * Accepts a functor.
     */
    <T> T apply( XSFunction<T> function );
}
